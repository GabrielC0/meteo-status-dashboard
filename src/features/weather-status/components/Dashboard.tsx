'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import StatusTable from './StatusTable';
import { useMarketData } from '../hooks/useMarketData';
import { titanServices, getStatusIcon, getStatusColor, getStatusText } from '@/data/clientData';

import styles from '@/styles/features/weather-status/components/Dashboard.module.scss';

const Dashboard = () => {
  const { enterprises, isLoading, error } = useMarketData();
  const titanService = titanServices[0];
  const [showTooltip, setShowTooltip] = useState(false);

  return error ? (
    <Layout title="Dashboard Status" hideHeader>
      <div className={styles.error}>
        <h2>Erreur de chargement</h2>
        <p>{error}</p>
      </div>
    </Layout>
  ) : (
    <Layout title="Dashboard Status" hideHeader>
      <StatusTable
        enterprises={enterprises}
        titanService={titanService}
        showTooltip={showTooltip}
        setShowTooltip={setShowTooltip}
        getStatusIcon={getStatusIcon}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
        isLoading={isLoading}
      />
    </Layout>
  );
};

export default Dashboard;
