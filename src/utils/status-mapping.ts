export const mapToMarketDataStatus = (
  status: string,
): "SUCCESS" | "WARNING" | "ERROR" | "UNKNOWN" => {
  switch (status) {
    case "operational":
      return "SUCCESS";
    case "degraded":
    case "warning":
      return "WARNING";
    case "outage":
    case "error":
      return "ERROR";
    default:
      return "UNKNOWN";
  }
};
