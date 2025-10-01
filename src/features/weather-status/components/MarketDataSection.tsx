'use client';

import { memo } from 'react';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import styles from '@/styles/features/weather-status/components/Dashboard.module.scss';

const MarketDataSection = () => {
  return (
    <ErrorBoundary>
      <section className={styles.section} aria-label="Section Données de marché">
        <div className={styles.sectionHeader}>Données de marché</div>
        <div className={styles.sectionBody}></div>
      </section>
    </ErrorBoundary>
  );
};

MarketDataSection.displayName = 'WeatherStatus.MarketDataSection';

export default memo(MarketDataSection);
