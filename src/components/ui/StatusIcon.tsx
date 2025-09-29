import { memo, useEffect, useMemo, useState } from 'react';
import { MarketDataStatus } from '@/features/weather-status/types/Index.types';
import { StatusIcons } from '@/components/icons';
import dynamic from 'next/dynamic';
import styles from '@/styles/components/ui/StatusIcon.module.scss';
import { useTranslations } from '@/i18n';

const Tooltip = dynamic(() => import('react-tooltip').then((m) => m.Tooltip), {
  ssr: false,
});

export interface IconProps {
  width?: number;
  height?: number;
  className?: string;
}

interface StatusIconProps {
  status: MarketDataStatus;
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
}

const StatusIcon = ({ status, size = 'medium', showTooltip = true }: StatusIconProps) => {
  const { translation } = useTranslations();
  const [tooltipId, setTooltipId] = useState<string>('');

  useEffect(() => {
    setTooltipId(`status-tooltip-${status}-${Math.random().toString(36).slice(2, 11)}`);
  }, [status]);

  const sizeConfig = {
    small: { width: 16, height: 16 },
    medium: { width: 20, height: 20 },
    large: { width: 24, height: 24 },
  };

  const statusLabels = useMemo(
    () => ({
      SUCCESS: translation('status.success'),
      WARNING: translation('status.warning'),
      ERROR: translation('status.error'),
      UNKNOWN: translation('status.unknown'),
    }),
    [translation],
  );

  const statusColors = {
    SUCCESS: '#22c55e',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
    UNKNOWN: '#6b7280',
  };

  const currentSize = sizeConfig[size];
  const statusClass = styles[`icon${status}`];
  const sizeClass = styles[size];
  const className = `${statusClass} ${sizeClass}`;

  const IconComponent = StatusIcons[status];

  const ariaLabel = useMemo(
    () => `${translation('a11y.statusIcon')}: ${statusLabels[status]}`,
    [status, statusLabels, translation],
  );

  return (
    <>
      <div
        data-tooltip-id={tooltipId || undefined}
        style={{ display: 'inline-block', cursor: 'default' }}
        role="img"
        aria-label={ariaLabel}
      >
        <IconComponent
          width={currentSize.width}
          height={currentSize.height}
          className={className}
        />
      </div>
      {tooltipId && showTooltip && (
        <Tooltip
          id={tooltipId}
          content={statusLabels[status]}
          place="top"
          style={{
            backgroundColor: statusColors[status],
            color: '#fff',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
          }}
        />
      )}
    </>
  );
};

StatusIcon.displayName = 'Ui.StatusIcon';

export default memo(StatusIcon);
