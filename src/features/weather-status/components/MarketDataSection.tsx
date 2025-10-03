'use client';

import { memo, useMemo } from 'react';

import ErrorBoundary from '@/components/ui/ErrorBoundary';
import ChartWrapper from '@/components/ui/ChartWrapper';
import { useAppSelector } from '@/stores';
import { getTitanCompanies } from '@/stores';

import styles from '@/styles/features/weather-status/components/Dashboard.module.scss';

const MarketDataSection = () => {
  const companies = useAppSelector(getTitanCompanies);

  const stats = useMemo(() => {
    const counts: { SUCCESS: number; WARNING: number; ERROR: number } = {
      SUCCESS: 0,
      WARNING: 0,
      ERROR: 0,
    };
    for (const c of companies) {
      if (c.marketDataStatus === 'SUCCESS') counts.SUCCESS += 1;
      else if (c.marketDataStatus === 'WARNING') counts.WARNING += 1;
      else if (c.marketDataStatus === 'ERROR') counts.ERROR += 1;
    }
    return counts;
  }, [companies]);

  const items: Array<{
    label: 'SUCCESS' | 'WARNING' | 'ERROR';
    value: number;
    variant: 'variantSuccess' | 'variantWarning' | 'variantError';
  }> = [
    { label: 'SUCCESS', value: stats.SUCCESS, variant: 'variantSuccess' },
    { label: 'WARNING', value: stats.WARNING, variant: 'variantWarning' },
    { label: 'ERROR', value: stats.ERROR, variant: 'variantError' },
  ];

  const donutSeries = [
    {
      type: 'pie' as const,
      name: 'Entreprises',
      innerSize: '75%',
      data: [
        { name: 'SUCCESS', y: stats.SUCCESS, color: '#22c55e' },
        { name: 'WARNING', y: stats.WARNING, color: '#f59e0b' },
        { name: 'ERROR', y: stats.ERROR, color: '#ef4444' },
      ],
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b><br>{point.y}',
      },
      showInLegend: true,
    },
  ];

  return (
    <ErrorBoundary>
      <section className={styles.section} aria-label="Section Données de marché">
        <div className={styles.sectionHeader}>Données de marché</div>
        <div className={styles.sectionBody}>
          <div className={`${styles.statsGrid} ${styles['dashboard__statsGridCenter']}`}>
            {items.map((it) => (
              <div key={it.label} className={`${styles.statCard} ${styles[it.variant]}`}>
                <div className={styles.statLabel}>{it.label}</div>
                <div className={styles.statValue}>{String(it.value)}</div>
              </div>
            ))}
          </div>

          <div className={styles.chartCard}>
            <ChartWrapper
              type="pie"
              title="Statut des entreprises Market Data"
              series={donutSeries}
              height={450}
              showLegend={true}
              showDataLabels={true}
              tooltipFormat="<b>{point.y}</b> entreprises ({point.percentage:.1f}%)"
              centerLabel={{
                title: 'Total',
                value: stats.SUCCESS + stats.WARNING + stats.ERROR,
                enabled: true,
              }}
            />
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

MarketDataSection.displayName = 'WeatherStatus.MarketDataSection';

export default memo(MarketDataSection);
