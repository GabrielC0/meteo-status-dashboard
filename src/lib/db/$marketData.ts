import { query } from './config';
import type {
  MarketDataCompany,
  MarketDataOperation,
  MarketDataStatus,
} from '@/types/MarketData.types';
import type { MarketDataCompanyRow, MarketDataOperationRow } from '@/types/MarketData.types';

export const getAllCompaniesWithOperations = async (): Promise<MarketDataCompany[]> => {
  try {
    const companies = await query<MarketDataCompanyRow[]>(
      `SELECT 
        id, company_code, company_name, status, 
        total_operations, last_update, is_active
      FROM market_data_companies
      WHERE is_active = TRUE
      ORDER BY company_name ASC`,
    );

    if (companies.length === 0) {
      return [];
    }

    const companyIds = companies.map((c) => c.id);
    const placeholders = companyIds.map(() => '?').join(',');

    const operations = await query<MarketDataOperationRow[]>(
      `SELECT 
        company_id, operation_type, devise1, devise2, 
        type_recuperation, last_market_data_update, status
      FROM market_data_operations
      WHERE company_id IN (${placeholders})
      ORDER BY company_id, last_market_data_update DESC`,
      companyIds,
    );

    const operationsByCompany = new Map<number, MarketDataOperation[]>();
    for (const op of operations) {
      if (!operationsByCompany.has(op.company_id)) {
        operationsByCompany.set(op.company_id, []);
      }
      operationsByCompany.get(op.company_id)!.push({
        operationType: op.operation_type,
        lastMarketDataUpdate: op.last_market_data_update.toISOString(),
        devise1: op.devise1,
        devise2: op.devise2 || undefined,
        typeRecuperation: op.type_recuperation,
        status: op.status,
      });
    }

    return companies.map((company) => ({
      id: company.company_code,
      name: company.company_name,
      totalOperations: company.total_operations,
      marketDataStatus: company.status,
      lastMarketDataUpdate: company.last_update.toISOString(),
      operations: operationsByCompany.get(company.id) || [],
    }));
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des companies:', error);
    throw new Error('Failed to fetch market data companies');
  }
};

export const getCompanyByCode = async (companyCode: string): Promise<MarketDataCompany | null> => {
  try {
    const [company] = await query<MarketDataCompanyRow[]>(
      `SELECT 
        id, company_code, company_name, status, 
        total_operations, last_update, is_active
      FROM market_data_companies
      WHERE company_code = ? AND is_active = TRUE`,
      [companyCode],
    );

    if (!company) {
      return null;
    }

    const operations = await query<MarketDataOperationRow[]>(
      `SELECT 
        operation_type, devise1, devise2, type_recuperation, 
        last_market_data_update, status
      FROM market_data_operations
      WHERE company_id = ?
      ORDER BY last_market_data_update DESC`,
      [company.id],
    );

    return {
      id: company.company_code,
      name: company.company_name,
      totalOperations: company.total_operations,
      marketDataStatus: company.status,
      lastMarketDataUpdate: company.last_update.toISOString(),
      operations: operations.map((op) => ({
        operationType: op.operation_type,
        lastMarketDataUpdate: op.last_market_data_update.toISOString(),
        devise1: op.devise1,
        devise2: op.devise2 || undefined,
        typeRecuperation: op.type_recuperation,
        status: op.status,
      })),
    };
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération de la company ${companyCode}:`, error);
    return null;
  }
};

export const updateCompanyStatus = async (
  companyCode: string,
  newStatus: MarketDataStatus,
  changedBy = 'system',
): Promise<boolean> => {
  try {
    await query(
      `CALL sp_update_company_status(
        (SELECT id FROM market_data_companies WHERE company_code = ?),
        ?,
        ?
      )`,
      [companyCode, newStatus, changedBy],
    );
    return true;
  } catch (error) {
    console.error(`❌ Erreur lors de la mise à jour du statut de ${companyCode}:`, error);
    return false;
  }
};

export const addOperation = async (
  companyCode: string,
  operation: Omit<MarketDataOperation, 'lastMarketDataUpdate'> & { lastMarketDataUpdate?: string },
): Promise<boolean> => {
  try {
    const [company] = await query<{ id: number }[]>(
      'SELECT id FROM market_data_companies WHERE company_code = ?',
      [companyCode],
    );

    if (!company) {
      throw new Error(`Company ${companyCode} not found`);
    }

    await query(
      `INSERT INTO market_data_operations
        (company_id, operation_type, devise1, devise2, type_recuperation, last_market_data_update)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        company.id,
        operation.operationType,
        operation.devise1,
        operation.devise2 || null,
        operation.typeRecuperation,
        operation.lastMarketDataUpdate || new Date(),
      ],
    );

    await query(
      `UPDATE market_data_companies 
       SET total_operations = total_operations + 1, updated_at = NOW()
       WHERE id = ?`,
      [company.id],
    );

    return true;
  } catch (error) {
    console.error(`❌ Erreur lors de l'ajout de l'opération pour ${companyCode}:`, error);
    return false;
  }
};

export const getMarketDataStats = async () => {
  try {
    const [stats] = await query<
      {
        total_companies: number;
        companies_success: number;
        companies_warning: number;
        companies_error: number;
        total_operations: number;
      }[]
    >(
      `SELECT 
        COUNT(*) as total_companies,
        SUM(CASE WHEN status = 'SUCCESS' THEN 1 ELSE 0 END) as companies_success,
        SUM(CASE WHEN status = 'WARNING' THEN 1 ELSE 0 END) as companies_warning,
        SUM(CASE WHEN status = 'ERROR' THEN 1 ELSE 0 END) as companies_error,
        SUM(total_operations) as total_operations
      FROM market_data_companies
      WHERE is_active = TRUE`,
    );

    return (
      stats || {
        total_companies: 0,
        companies_success: 0,
        companies_warning: 0,
        companies_error: 0,
        total_operations: 0,
      }
    );
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des stats:', error);
    throw error;
  }
};

const marketDataService = {
  getAllCompaniesWithOperations,
  getCompanyByCode,
  updateCompanyStatus,
  addOperation,
  getMarketDataStats,
};

export default marketDataService;
