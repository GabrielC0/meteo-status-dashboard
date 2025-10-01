'use client';

import { memo } from 'react';
import { getTitanError, useAppSelector } from '@/stores';
import Layout from '@/components/layout/Layout';
import MarketDataSection from './MarketDataSection';
import TitanSection from './TitanSection';
import styles from '@/styles/features/weather-status/components/Dashboard.module.scss';

const Dashboard = () => {
  const titanError = useAppSelector(getTitanError);

  const error = titanError;

  return (
    <Layout title="Dashboard" hideHeader>
      <div className={styles.pageContainer}>
        {error && (
          <div className={styles.error} role="alert">
            <h2>Erreur de chargement</h2>
            <p>{error}</p>
          </div>
        )}
        <div className={styles.verticalSplit}>
          <MarketDataSection />
          <TitanSection />
        </div>
      </div>
    </Layout>
  );
};

Dashboard.displayName = 'WeatherStatus.Dashboard';

export default memo(Dashboard);
