export interface TitanService {
  id: string;
  name: string;
  status: "operational" | "degraded" | "outage" | "maintenance";
  uptime: number;
  lastCheck: Date;
  description: string;
  dependencies: string[];
}

export interface MarketDataSource {
  id: string;
  name: string;
  status: "operational" | "warning" | "error" | "maintenance";
  lastUpdate: Date;
  dataQuality: number;
  latency: number;
  errorRate: number;
  recordsProcessed: number;
  provider: string;
}

export const titanServices: TitanService[] = [
  {
    id: "titan-system",
    name: "TITAN",
    status: "operational",
    uptime: 99.97,
    lastCheck: new Date("2025-09-16T10:30:00Z"),
    description:
      "Service TITAN - Plateforme de trading et de gestion des risques",
    dependencies: ["database", "cache-redis", "message-queue"],
  },
];

export const marketDataSources: MarketDataSource[] = [
  {
    id: "market-data",
    name: "MARKET DATA System",
    status: "operational",
    lastUpdate: new Date("2025-09-16T10:29:58Z"),
    dataQuality: 98.5,
    errorRate: 0.02,
    recordsProcessed: 2500000,
    provider: "Multi-Provider Feed",
    latency: 45,
  },
];

export const getStatusIcon = (status: string): string => {
  const statusIcons: Record<string, string> = {
    operational: "☀️",
    active: "☀️",
    degraded: "⛅",
    warning: "⛅",
    outage: "⛈️",
    error: "⛈️",
    maintenance: "☁️",
  };
  return statusIcons[status] || "☁️";
};

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    operational: "#10b981",
    active: "#10b981",
    degraded: "#f59e0b",
    warning: "#f59e0b",
    outage: "#ef4444",
    error: "#ef4444",
    maintenance: "#6b7280",
  };
  return statusColors[status] || "#6b7280";
};

export const getStatusText = (status: string): string => {
  const statusTexts: Record<string, string> = {
    operational: "Success",
    active: "Actif",
    degraded: "Dégradé",
    warning: "Attention",
    outage: "Panne",
    error: "Erreur",
    maintenance: "Maintenance",
  };
  return statusTexts[status] || status;
};

export const formatUptime = (uptime: number): string => {
  return `${uptime.toFixed(2)}%`;
};

export const formatLatency = (latency: number): string => {
  return `${latency.toFixed(0)}ms`;
};

export const formatDataQuality = (quality: number): string => {
  return `${quality.toFixed(1)}%`;
};

export const formatErrorRate = (rate: number): string => {
  return `${rate.toFixed(2)}%`;
};

export const formatRecordsProcessed = (records: number): string => {
  if (records >= 1000000) {
    return `${(records / 1000000).toFixed(1)}M`;
  } else if (records >= 1000) {
    return `${(records / 1000).toFixed(0)}K`;
  }
  return records.toString();
};

export const getPercentageColor = (percentage: number): string => {
  if (percentage >= 98) return "#10b981"; // Vert
  if (percentage >= 95) return "#f59e0b"; // Orange
  if (percentage >= 90) return "#ef4444"; // Rouge
  return "#dc2626"; // Rouge foncé
};

export const getOverallSystemStatus = (): {
  titan: { status: string; issues: number; total: number };
  marketData: { status: string; issues: number; total: number };
} => {
  const titanIssues = titanServices.filter(
    (service) => service.status !== "operational"
  ).length;

  const marketDataIssues = marketDataSources.filter(
    (source) => source.status !== "operational"
  ).length;

  const getTitanStatus = () => {
    if (titanIssues === 0) return "operational";
    return "critical";
  };

  const getMarketDataStatus = () => {
    if (marketDataIssues === 0) return "operational";
    return "critical";
  };

  return {
    titan: {
      status: getTitanStatus(),
      issues: titanIssues,
      total: titanServices.length,
    },
    marketData: {
      status: getMarketDataStatus(),
      issues: marketDataIssues,
      total: marketDataSources.length,
    },
  };
};
