"use client";

import {
  titanServices,
  marketDataSources,
  getPercentageColor,
  getStatusColor,
  getStatusText,
} from "@/data/clientData";
import { ClientLogoIcon } from "@/components/icons/LogoIcon";
import StatusIcon from "@/components/ui/StatusIcon";
import { mapToMarketDataStatus } from "@/utils/status-mapping";

import styles from "./ClientPage.module.css";

const ClientPage = () => {
  const titanService = titanServices[0];
  const marketDataSource = marketDataSources[0];

  return (
    <div className={styles.container}>
      <div className={styles.logoBackground}>
        <ClientLogoIcon />
      </div>

      <div className={styles.content}>
        <div className={styles.statusTable}>
          <div className={styles.tableHeader}>
            <h2>Dashboard Status</h2>
          </div>

          <div className={styles.tableBody}>
            <div className={styles.statusRow}>
              <div className={styles.serviceColumn}>
                <div className={styles.serviceIcon}>
                  <StatusIcon
                    status={mapToMarketDataStatus(titanService.status)}
                    size="large"
                  />
                </div>
                <div className={styles.serviceInfo}>
                  <h3 className={styles.serviceName}>TITAN</h3>
                </div>
              </div>

              <div className={styles.statusColumn}>
                <div
                  className={styles.statusBadge}
                  style={{
                    backgroundColor: getStatusColor(titanService.status),
                  }}
                >
                  {getStatusText(titanService.status)}
                </div>
              </div>

              <div className={styles.metricsColumn}>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Uptime</span>
                  <span
                    className={styles.metricValue}
                    style={{ color: getPercentageColor(titanService.uptime) }}
                  >
                    {titanService.uptime.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className={styles.lastUpdateColumn}>
                <span className={styles.lastUpdateLabel}>
                  Dernière vérification
                </span>
                <span className={styles.lastUpdateValue}>
                  {titanService.lastCheck.toLocaleTimeString("fr-FR")}
                </span>
              </div>
            </div>

            <div className={styles.statusRow}>
              <div className={styles.serviceColumn}>
                <div className={styles.serviceIcon}>
                  <StatusIcon
                    status={mapToMarketDataStatus(marketDataSource.status)}
                    size="large"
                  />
                </div>
                <div className={styles.serviceInfo}>
                  <h3 className={styles.serviceName}>Market Data</h3>
                </div>
              </div>

              <div className={styles.statusColumn}>
                <div
                  className={styles.statusBadge}
                  style={{
                    backgroundColor: getStatusColor(marketDataSource.status),
                  }}
                >
                  {getStatusText(marketDataSource.status)}
                </div>
              </div>

              <div className={styles.metricsColumn}>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Qualité</span>
                  <span
                    className={styles.metricValue}
                    style={{
                      color: getPercentageColor(marketDataSource.dataQuality),
                    }}
                  >
                    {marketDataSource.dataQuality.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className={styles.lastUpdateColumn}>
                <span className={styles.lastUpdateLabel}>
                  Dernière mise à jour
                </span>
                <span className={styles.lastUpdateValue}>
                  {marketDataSource.lastUpdate.toLocaleTimeString("fr-FR")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPage;
