"use client";

import { StatusBadge } from "@/components/ui";
import { MarketDataCompany } from "../types/index.types";
import styles from "./StatusTable.module.css";

const StatusTable = ({ enterprises }: { enterprises: MarketDataCompany[] }) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.statusTable}>
        <thead>
          <tr>
            <th>Entreprise</th>
            <th>Status</th>
            <th>Dernière Mise à Jour</th>
          </tr>
        </thead>
        <tbody>
          {enterprises.length === 0 ? (
            <tr className={styles.emptyRow}>
              <td colSpan={3} className={styles.emptyMessage}>
                Aucune entreprise configurée
              </td>
            </tr>
          ) : (
            enterprises.map((enterprise) => (
              <tr key={enterprise.id}>
                <td className={styles.serviceName}>
                  {enterprise.name}
                  <span className={styles.operationsCount}>
                    ({enterprise.totalOperations} opérations)
                  </span>
                </td>
                <td className={styles.statusCell}>
                  <StatusBadge
                    status={enterprise.marketDataStatus}
                    size="medium"
                  />
                </td>
                <td className={styles.dateCell}>
                  {enterprise.lastMarketDataUpdate}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StatusTable;
