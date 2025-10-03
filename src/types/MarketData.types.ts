export type MarketDataStatus = 'SUCCESS' | 'WARNING' | 'ERROR' | 'UNKNOWN';

export type OverallStatus = 'SUCCESS' | 'WARNING' | 'ERROR';

export type MarketDataOperation = {
  operationType: string;
  lastMarketDataUpdate: string;
  devise1: string;
  devise2?: string;
  typeRecuperation: string;
  status: MarketDataStatus;
};

export type MarketDataCompany = {
  id: string;
  name: string;
  totalOperations: number;
  marketDataStatus: MarketDataStatus;
  lastMarketDataUpdate: string;
  operations: MarketDataOperation[];
};

export type MarketDataCompanyRow = {
  id: number;
  company_code: string;
  company_name: string;
  status: MarketDataStatus;
  total_operations: number;
  last_update: Date;
  is_active: boolean;
};

export type MarketDataOperationRow = {
  id: number;
  company_id: number;
  operation_type: string;
  devise1: string;
  devise2: string | null;
  type_recuperation: string;
  last_market_data_update: Date;
  status: MarketDataStatus;
  error_message: string | null;
};

export type MarketDataStats = {
  total_companies: number;
  companies_success: number;
  companies_warning: number;
  companies_error: number;
  total_operations: number;
};

export type MarketDataState = {
  companies: MarketDataCompany[];
  isLoading: boolean;
  error: string | null;
  lastUpdate: string | null;
};
