export interface MarketDataOperation {
  operationType: string;
  lastMarketDataUpdate: string;
  devise1: string;
  devise2?: string;
  typeRecuperation: string;
}

export interface MarketDataCompany {
  id: string;
  name: string;
  totalOperations: number;
  marketDataStatus: MarketDataStatus;
  lastMarketDataUpdate: string;
  operations: MarketDataOperation[];
}

export type MarketDataStatus = 'SUCCESS' | 'WARNING' | 'ERROR' | 'UNKNOWN';

export * from './MarketData.types';

export type SortKey = 'name' | 'status' | 'date';
