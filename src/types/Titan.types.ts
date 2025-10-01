export type TitanService = {
  id: number;
  service_code: string;
  service_name: string;
  service_type: 'API' | 'AUTH' | 'DATABASE' | 'CACHE' | 'OTHER';
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  uptime_percentage: number;
  last_check: string;
  response_time_ms: number | null;
  description: string | null;
  dependencies: string[] | null;
};

export type TitanSession = {
  id: number;
  timestamp: string;
  active_sessions: number;
  cpu_usage_percent: number;
  memory_usage_mb: number | null;
};

export type TitanServiceRow = {
  id: number;
  service_code: string;
  service_name: string;
  service_type: string;
  status: string;
  uptime_percentage: number;
  last_check: Date;
  response_time_ms: number | null;
  description: string | null;
  dependencies: string | null;
};

export type TitanSessionRow = {
  id: number;
  timestamp: Date;
  active_sessions: number;
  cpu_usage_percent: number;
  memory_usage_mb: number | null;
};

export type TitanTicketStats = {
  total_tickets: number;
  tickets_nouveau: number;
  tickets_ouvert: number;
  tickets_en_attente: number;
  tickets_resolu: number;
  tickets_ferme: number;
  avg_resolution_hours: number | null;
};

export type TitanDashboardData = {
  companies: {
    id: string;
    name: string;
    totalOperations: number;
    marketDataStatus: string;
    lastMarketDataUpdate: string;
    operations: Array<{
      operationType: string;
      lastMarketDataUpdate: string;
      devise1: string;
      devise2?: string;
      typeRecuperation: string;
    }>;
  }[];
  sessions: TitanSession[];
  ticketsStats: TitanTicketStats | null;
};

export type TitanState = {
  companies: TitanDashboardData['companies'];
  sessions: TitanSession[];
  ticketsStats: TitanTicketStats | null;
  isLoading: boolean;
  error: string | null;
  lastUpdate: string | null;
};
