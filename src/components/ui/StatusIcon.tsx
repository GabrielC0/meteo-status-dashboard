import { MarketDataStatus } from "@/features/weather-status/types/index.types";
import { StatusIcons } from "@/components/icons";
import styles from "./StatusIcon.module.css";

export interface IconProps {
  width?: number;
  height?: number;
  className?: string;
}

interface StatusIconProps {
  status: MarketDataStatus;
  size?: "small" | "medium" | "large";
}

const StatusIcon = ({ status, size = "medium" }: StatusIconProps) => {
  const sizeConfig = {
    small: { width: 16, height: 16 },
    medium: { width: 20, height: 20 },
    large: { width: 24, height: 24 },
  };

  const currentSize = sizeConfig[size];
  const statusClass = styles[`icon${status}`];
  const sizeClass = styles[size];
  const className = `${statusClass} ${sizeClass}`;

  const IconComponent = StatusIcons[status];

  return (
    <IconComponent
      width={currentSize.width}
      height={currentSize.height}
      className={className}
    />
  );
};

export default StatusIcon;
