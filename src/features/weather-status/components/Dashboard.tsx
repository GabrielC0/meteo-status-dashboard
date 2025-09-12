"use client";

import Layout from "@/components/layout/Layout";
import StatusTable from "./StatusTable";
import { useMarketData } from "../hooks/useMarketData";

import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const { enterprises, isLoading, error } = useMarketData();

  return error ? (
    <Layout title="Tableau de Bord Météo Status">
      <div className={styles.error}>
        <h2>Erreur de chargement</h2>
        <p>{error}</p>
      </div>
    </Layout>
  ) : (
    <Layout title="Tableau de Bord Market Data Status">
      {isLoading ? (
        <div className={styles.loading}>
          <p>Chargement des données de marché...</p>
        </div>
      ) : (
        <StatusTable enterprises={enterprises} />
      )}
    </Layout>
  );
};

export default Dashboard;
