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
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { mapToMarketDataStatus } from "@/utils/status-mapping";
import { useTranslations, useLanguage } from "@/i18n";

import styles from "@/styles/app/client/ClientPage.module.scss";

const ClientPage = () => {
  const { translation } = useTranslations();
  const { locale } = useLanguage();
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
            <h2>{translation("client.dashboardStatus")}</h2>
            <LanguageSwitcher />
          </div>

          <div className={styles.tableBody}>
            <div className={styles.statusRow}>
              <div className={styles.serviceColumn}>
                <div className={styles.serviceIcon}>
                  <StatusIcon status={mapToMarketDataStatus(titanService.status)} size="large" />
                </div>
                <div className={styles.serviceInfo}>
                  <h3 className={styles.serviceName}>{translation("client.titan")}</h3>
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
                  <span className={styles.metricLabel}>{translation("client.uptime")}</span>
                  <span
                    className={styles.metricValue}
                    style={{ color: getPercentageColor(titanService.uptime) }}
                  >
                    {titanService.uptime.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className={styles.lastUpdateColumn}>
                <span className={styles.lastUpdateLabel}>{translation("client.lastCheck")}</span>
                <span className={styles.lastUpdateValue}>
                  {titanService.lastCheck.toLocaleTimeString(
                    locale === "fr"
                      ? "fr-FR"
                      : locale === "en"
                        ? "en-US"
                        : locale === "es"
                          ? "es-ES"
                          : locale === "pt"
                            ? "pt-BR"
                            : "it-IT",
                  )}
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
                  <h3 className={styles.serviceName}>{translation("client.marketData")}</h3>
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
                  <span className={styles.metricLabel}>{translation("client.quality")}</span>
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
                <span className={styles.lastUpdateLabel}>{translation("client.lastUpdate")}</span>
                <span className={styles.lastUpdateValue}>
                  {marketDataSource.lastUpdate.toLocaleTimeString(
                    locale === "fr"
                      ? "fr-FR"
                      : locale === "en"
                        ? "en-US"
                        : locale === "es"
                          ? "es-ES"
                          : locale === "pt"
                            ? "pt-BR"
                            : "it-IT",
                  )}
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
