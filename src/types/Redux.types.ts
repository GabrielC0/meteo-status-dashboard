export type MockCompany = {
  id: number;
  name: string;
  marketDataStatus: 'SUCCESS' | 'WARNING' | 'ERROR' | 'UNKNOWN';
  operations: Array<{
    operation_type: string;
    devise1: string;
    devise2?: string;
    type_recuperation: string;
    last_market_data_update: string;
    status: 'SUCCESS' | 'WARNING' | 'ERROR' | 'UNKNOWN';
  }>;
};

export type MockSession = {
  timestamp: string;
  active_sessions: number;
  cpu_usage_percent: number;
  memory_usage_mb: number;
};

export type MockTicketsStats = {
  tickets_nouveau: number;
  tickets_ouvert: number;
  tickets_en_attente: number;
};

export type TitanState = {
  companies: MockCompany[];
  sessions: MockSession[];
  ticketsStats: MockTicketsStats | null;
  isLoading: boolean;
  error: string | null;
  lastUpdate: string | null;
};

export type LanguageState = {
  currentLocale: 'fr' | 'en' | 'es' | 'pt' | 'it';
};
