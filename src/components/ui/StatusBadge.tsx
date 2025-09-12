import { MarketDataStatus } from "@/features/weather-status/types/index.types";

import StatusIcon from "./StatusIcon";

import styles from "./StatusBadge.module.css";

interface StatusBadgeProps {
  status: MarketDataStatus;
  showText?: boolean;
  size?: "small" | "medium" | "large";
}

const StatusBadge = ({
  status,
  showText = true,
  size = "medium",
}: StatusBadgeProps) => {
  const getStatusText = (status: MarketDataStatus): string => {
    switch (status) {
      case "SUCCESS":
        return "Success";
      case "WARNING":
        return "Attention";
      case "ERROR":
        return "Erreur";
      case "UNKNOWN":
      default:
        return "Inconnu";
    }
  };

  return (
    <div
      className={`${styles.badge} ${styles[`badge${status}`]} ${styles[size]}`}
    >
      <StatusIcon status={status} size={size} />
      {showText && <span className={styles.text}>{getStatusText(status)}</span>}
    </div>
  );
};

export default StatusBadge;
