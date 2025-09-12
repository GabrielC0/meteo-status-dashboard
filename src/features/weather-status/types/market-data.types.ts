export interface MarketDataRecord {
  entity: string;
  dataType: string;
  dateCode: number;
  operations: string;
  currency?: string;
  status: string;
}

export interface ParsedMarketData {
  totalRecords: number;
  errorCount: number;
  entities: string[];
  dataTypes: string[];
  lastUpdateDate: Date;
  csvData: MarketDataRecord[];
}

export interface MarketDataSummary {
  entity: string;
  totalOperations: number;
  dataTypes: string[];
  lastUpdate: Date;
  status: "SUCCESS" | "WARNING" | "ERROR" | "UNKNOWN";
  errorMessage?: string;
}
