export interface MarketDataCompany {
  id: string;
  name: string;
  totalOperations: number;
  marketDataStatus: MarketDataStatus;
  lastMarketDataUpdate: string;
}

export type MarketDataStatus = "SUCCESS" | "WARNING" | "ERROR" | "UNKNOWN";

export * from "./market-data.types";
