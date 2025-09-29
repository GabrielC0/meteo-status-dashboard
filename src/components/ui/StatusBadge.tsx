import { MarketDataStatus } from "@/features/weather-status/types/Index.types";

import StatusIcon from "./StatusIcon";
import { memo } from "react";

import styles from "@/styles/components/ui/StatusBadge.module.scss";

interface StatusBadgeProps {
  status: MarketDataStatus;
  showText?: boolean;
  size?: "small" | "medium" | "large";
}

const StatusBadge = ({ status, showText = true, size = "medium" }: StatusBadgeProps) => {
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
    <div className={`${styles.badge} ${styles[`badge${status}`]} ${styles[size]}`}>
      <StatusIcon status={status} size={size} />
      {showText && <span className={styles.text}>{getStatusText(status)}</span>}
    </div>
  );
};

StatusBadge.displayName = "Ui.StatusBadge";

export default memo(StatusBadge);
