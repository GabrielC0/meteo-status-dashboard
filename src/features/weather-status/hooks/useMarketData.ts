"use client";

import { useState, useEffect, useCallback } from "react";
import { getMarketDataCompanies } from "../services/dataService";

import { MarketDataCompany } from "../types/index.types";

const CSV_FILE = "/csv/checkDataMarket_db001_20250911_1012.csv";

export const useMarketData = () => {
  const [enterprises, setEnterprises] = useState<MarketDataCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableFiles, setAvailableFiles] = useState<string[]>([]);
  const [currentFile, setCurrentFile] = useState<string | null>(null);

  const loadMarketData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const marketDataCompanies = await getMarketDataCompanies();

      if (marketDataCompanies.length === 0) {
        setError("No data found in the CSV file.");
        setEnterprises([]);
        return;
      }

      setCurrentFile(CSV_FILE);
      setAvailableFiles([CSV_FILE]);
      setEnterprises(marketDataCompanies);
    } catch (err) {
      setError(String(err));
      setEnterprises([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshEnterprise = useCallback(
    async (enterpriseId: string) => {
      try {
        await loadMarketData();
      } catch (err) {
        console.error("Error updating data:", err);
        setEnterprises((prev) =>
          prev.map((enterprise) =>
            enterprise.id === enterpriseId
              ? { ...enterprise, lastUpdate: new Date() }
              : enterprise
          )
        );
      }
    },
    [loadMarketData]
  );

  useEffect(() => {
    loadMarketData();
  }, [loadMarketData]);

  return {
    enterprises,
    isLoading,
    error,
    availableFiles,
    currentFile,
    refreshEnterprise,
    reloadData: loadMarketData,
  };
};
