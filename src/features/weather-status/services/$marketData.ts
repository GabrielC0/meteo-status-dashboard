'use client';

import Papa from 'papaparse';
import { MarketDataCompany, MarketDataStatus, MarketDataOperation } from '../types/index.types';

const CSV_FILE = '/csv/checkDataMarket_db001_20250911_1012.csv';

const getRandomStatus = (): MarketDataStatus =>
  Math.random() > 0.8 ? 'ERROR' : Math.random() > 0.6 ? 'WARNING' : 'SUCCESS';

const parseCSVData = (csvContent: string): MarketDataCompany[] => {
  const { data } = Papa.parse<string[]>(csvContent, {
    delimiter: ';',
    skipEmptyLines: true,
    header: false,
    transform: (value: string) => value?.trim(),
  });

  const companyMap = new Map<string, MarketDataCompany>();

  data.forEach((row) => {
    const [
      marketDataCompany,
      operationType,
      lastMarketDataUpdate,
      devise1,
      devise2OrTypeRecup,
      typeRecuperation,
    ] = row;

    if (
      !marketDataCompany ||
      marketDataCompany.includes('select ') ||
      marketDataCompany.includes('ERROR') ||
      marketDataCompany.includes('ORA-') ||
      marketDataCompany === '*' ||
      marketDataCompany.trim().length < 2
    ) {
      return;
    }

    const devise2: string | undefined =
      operationType === 'FXCROSS' || operationType === 'PTSWAP' ? devise2OrTypeRecup : undefined;

    const finalTypeRecuperation: string =
      operationType === 'FXCROSS' || operationType === 'PTSWAP'
        ? typeRecuperation || ''
        : devise2OrTypeRecup || '';

    const currentOperation: MarketDataOperation = {
      operationType: operationType || '',
      lastMarketDataUpdate: lastMarketDataUpdate || '',
      devise1: devise1 || '',
      devise2: devise2,
      typeRecuperation: finalTypeRecuperation,
    };

    const existing = companyMap.get(marketDataCompany);
    if (existing) {
      existing.totalOperations++;
      existing.operations.push(currentOperation);
    } else {
      const newCompany: MarketDataCompany = {
        id: marketDataCompany,
        name: marketDataCompany,
        totalOperations: 1,
        marketDataStatus: getRandomStatus(),
        lastMarketDataUpdate: lastMarketDataUpdate || '',
        operations: [currentOperation],
      };
      companyMap.set(marketDataCompany, newCompany);
    }
  });

  return [...companyMap.values()].sort((a, b) => a.name.localeCompare(b.name));
};

export const getMarketDataCompanies = async (): Promise<MarketDataCompany[]> => {
  try {
    const response = await fetch(CSV_FILE, { method: 'HEAD' });
    if (!response.ok) {
      return [];
    }

    const contentResponse = await fetch(CSV_FILE);
    if (!contentResponse.ok) {
      throw new Error(`Erreur ${contentResponse.status}: ${contentResponse.statusText}`);
    }

    const csvContent = await contentResponse.text();
    if (!csvContent.trim()) {
      throw new Error('Le fichier CSV est vide');
    }

    return parseCSVData(csvContent);
  } catch (error) {
    console.error('Erreur lors du chargement des données CSV:', error);
    return [];
  }
};

const marketDataService = {
  getMarketDataCompanies,
};

export default marketDataService;
