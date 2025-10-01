'use client';

import { memo } from 'react';
import type { TitanStatsProps } from '../types/Dashboard.types';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import styles from '@/styles/features/weather-status/components/Dashboard.module.scss';

const TitanStats = ({ stats }: TitanStatsProps) => {
  const items = [
    {
      label: 'Total connexions uniques',
      value: stats.uniqueConnections,
      variant: 'variantPrimary',
    },
    {
      label: 'Total connexions',
      value: stats.totalConnections,
      variant: 'variantCyan',
    },
    {
      label: 'Tickets nouveau',
      value: stats.ticketsNouveau,
      variant: 'variantSuccess',
    },
    {
      label: 'Tickets ouvert',
      value: stats.ticketsOuvert,
      variant: 'variantWarning',
    },
    {
      label: 'Tickets en attente',
      value: stats.ticketsEnAttente,
      variant: 'variantInfo',
    },
  ];

  return (
    <ErrorBoundary>
      <div className={styles.statsGrid}>
        {items.map((it) => (
          <div
            key={it.label}
            className={`${styles.statCard} ${styles[it.variant]}`}
            aria-label={it.label}
          >
            <div className={styles.statLabel}>{it.label}</div>
            <div className={styles.statValue}>{String(it.value)}</div>
          </div>
        ))}
      </div>
    </ErrorBoundary>
  );
};

TitanStats.displayName = 'WeatherStatus.TitanStats';

export default memo(TitanStats);
