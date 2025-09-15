"use client";

import { StatusIcons } from "@/components/icons";
import { MarketDataCompany } from "../types/index.types";
import { useMemo, useState } from "react";
import MultiSelect from "@/components/ui/MultiSelect";

import styles from "./StatusTable.module.css";
import { SortKey } from "../types/index.types";

// Converts Excel serial date number to milliseconds
const excelDaysToMilliseconds = (excelDaysString: string): number => {
  const excelDaysCount = Number(excelDaysString);

  if (!Number.isFinite(excelDaysCount)) {
    return 0;
  }

  return (
    Date.UTC(1899, 11, 30) + (excelDaysCount + 29221) * 24 * 60 * 60 * 1000
  );
};

// Converts Excel serial date number to formatted date string
const formatUpdateDate = (excelDaysString: string): string => {
  const dateInMilliseconds = excelDaysToMilliseconds(excelDaysString);

  if (dateInMilliseconds === 0) {
    return "Date inconnue";
  }

  const formattedDate = new Date(dateInMilliseconds);

  return formattedDate.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const StatusTable = ({ enterprises }: { enterprises: MarketDataCompany[] }) => {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const companyNames = useMemo(() => {
    const names = Array.from(new Set(enterprises.map((e) => e.name))).sort(
      (a, b) => a.localeCompare(b)
    );
    return names;
  }, [enterprises]);

  const rows = useMemo(() => {
    const filteredByCompany =
      selectedCompanies.length > 0
        ? enterprises.filter((e) => selectedCompanies.includes(e.name))
        : enterprises;

    const comparatorBy: Record<
      SortKey,
      (a: MarketDataCompany, b: MarketDataCompany) => number
    > = {
      name: (a, b) => a.name.localeCompare(b.name),
      status: (a, b) => a.marketDataStatus.localeCompare(b.marketDataStatus),
      date: (a, b) => {
        const aMs = excelDaysToMilliseconds(a.lastMarketDataUpdate);
        const bMs = excelDaysToMilliseconds(b.lastMarketDataUpdate);
        return aMs - bMs;
      },
    };

    const sorted = [...filteredByCompany].sort((a, b) => {
      const cmp = comparatorBy[sortKey](a, b);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [enterprises, selectedCompanies, sortKey, sortDir]);

  return (
    <div className={styles.tableContainer}>
      <div className={styles.filtersBar}>
        <div className={styles.filtersLeft}>
          <MultiSelect
            options={companyNames.map((n) => ({ value: n, label: n }))}
            value={selectedCompanies}
            onChange={setSelectedCompanies}
            placeholder="Toutes les entreprises"
            horsContractList={[
              "adp",
              "agache",
              "biomerieux",
              "bonduelle",
              "carrefour",
              "crca",
              "gdf",
              "ivanhoe",
              "seb",
              "vinciconstruction",
            ]}
          />
        </div>
        <div className={styles.filtersRight}>
          <label className={styles.label}>
            Trier par
            <select
              className={styles.select}
              value={sortKey}
              onChange={(e) => {
                const value = e.target.value;
                if (
                  value === "name" ||
                  value === "status" ||
                  value === "date"
                ) {
                  setSortKey(value);
                }
              }}
            >
              <option value="name">Nom</option>
              <option value="status">Statut</option>
              <option value="date">Dernière mise à jour</option>
            </select>
          </label>
          <button
            type="button"
            className={styles.sortButton}
            onClick={() => setSortDir((o) => (o === "asc" ? "desc" : "asc"))}
            aria-label="Changer l'ordre de tri"
            title={sortDir === "asc" ? "Ordre ascendant" : "Ordre descendant"}
          >
            {sortDir === "asc" ? "▲" : "▼"}
          </button>
          <button
            type="button"
            className={styles.sortButton}
            onClick={() => {
              setSelectedCompanies([]);
              setSortKey("name");
              setSortDir("asc");
            }}
            aria-label="Réinitialiser les filtres"
            title="Réinitialiser les filtres"
          >
            Reset
          </button>
        </div>
      </div>
      <table className={styles.statusTable}>
        <thead>
          <tr>
            <th>Status</th>
            <th>Entreprise</th>
            <th>Dernière Mise à Jour</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr className={styles.emptyRow}>
              <td colSpan={3} className={styles.emptyMessage}>
                Aucune entreprise configurée
              </td>
            </tr>
          ) : (
            rows.map((enterprise) => {
              const StatusIcon = StatusIcons[enterprise.marketDataStatus];

              return (
                <tr key={enterprise.id}>
                  <td className={styles.statusCell}>
                    <StatusIcon
                      width={24}
                      height={24}
                      className={styles.statusIcon}
                    />
                  </td>
                  <td className={styles.serviceName}>
                    {enterprise.name}
                    <span className={styles.operationsCount}>
                      ({enterprise.totalOperations} opérations)
                    </span>
                  </td>
                  <td className={styles.dateCell}>
                    {formatUpdateDate(enterprise.lastMarketDataUpdate)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StatusTable;
