'use client';

import StatusIcon from '@/components/ui/StatusIcon';
import NoContractIcon from '@/components/icons/NoContractIcon';
import Modal from '@/components/ui/Modal';
import { MarketDataCompany } from '../types/index.types';
import { useMemo, useState } from 'react';
import MultiSelect from '@/components/ui/MultiSelect';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { isValidTableSortKey } from '@/types/TableSort.types';
import { mapToMarketDataStatus } from '@/utils/status-mapping';
import { useTranslations, useLanguage } from '@/i18n';

import styles from '@/styles/features/weather-status/components/StatusTable.module.scss';
import { SortKey } from '../types/index.types';

// Converts Excel serial date number to milliseconds
const excelDaysToMilliseconds = (excelDaysString: string): number => {
  const excelDaysCount = Number(excelDaysString);

  if (!Number.isFinite(excelDaysCount)) {
    return 0;
  }

  return Date.UTC(1899, 11, 30) + (excelDaysCount + 29221) * 24 * 60 * 60 * 1000;
};

interface StatusTableProps {
  enterprises: MarketDataCompany[];
  titanService?: {
    status: string;
    lastCheck: Date;
  };
  showTooltip?: boolean;
  setShowTooltip?: (show: boolean) => void;
  getStatusIcon?: (status: string) => string;
  getStatusColor?: (status: string) => string;
  getStatusText?: (status: string) => string;
  isLoading?: boolean;
}

const StatusTable = ({
  enterprises,
  titanService,
  showTooltip,
  setShowTooltip,
  getStatusColor,
  isLoading,
}: StatusTableProps) => {
  const { translation } = useTranslations();
  const { locale } = useLanguage();
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [showHorsContrat, setShowHorsContrat] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEnterprise, setSelectedEnterprise] = useState<MarketDataCompany | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Converts Excel serial date number to formatted date string
  const formatUpdateDate = (excelDaysString: string): string => {
    const dateInMilliseconds = excelDaysToMilliseconds(excelDaysString);

    if (dateInMilliseconds === 0) {
      return translation('table.unknownDate');
    }

    const formattedDate = new Date(dateInMilliseconds);

    return (
      formattedDate.toLocaleDateString(
        locale === 'fr'
          ? 'fr-FR'
          : locale === 'es'
            ? 'es-ES'
            : locale === 'pt'
              ? 'pt-BR'
              : locale === 'it'
                ? 'it-IT'
                : 'en-US',
        {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        },
      ) +
      ' à ' +
      formattedDate.toLocaleTimeString(
        locale === 'fr'
          ? 'fr-FR'
          : locale === 'es'
            ? 'es-ES'
            : locale === 'pt'
              ? 'pt-BR'
              : locale === 'it'
                ? 'it-IT'
                : 'en-US',
      )
    );
  };

  const horsContractList = useMemo(
    () => [
      'adp',
      'agache',
      'biomerieux',
      'bonduelle',
      'carrefour',
      'crca',
      'gdf',
      'ivanhoe',
      'seb',
      'vinciconstruction',
    ],
    [],
  );

  const companyNames = useMemo(() => {
    const names = Array.from(new Set(enterprises.map((e) => e.name))).sort((a, b) =>
      a.localeCompare(b),
    );
    return names;
  }, [enterprises]);

  const rows = useMemo(() => {
    const filteredByContract = showHorsContrat
      ? enterprises
      : enterprises.filter((e) => !horsContractList.includes(e.name.toLowerCase()));

    const filteredByCompany =
      selectedCompanies.length > 0
        ? filteredByContract.filter((e) => selectedCompanies.includes(e.name))
        : filteredByContract;

    const comparatorBy: Record<SortKey, (a: MarketDataCompany, b: MarketDataCompany) => number> = {
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
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return sorted;
  }, [enterprises, selectedCompanies, sortKey, sortDir, showHorsContrat, horsContractList]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(rows.length / pageSize));
  }, [rows.length]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, currentPage]);

  return (
    <div className={styles.tableContainer}>
      {titanService && (
        <div className={styles.titanStatusBubble}>
          <div className={styles.statusSection}>
            <div
              className={styles.bubbleIcon}
              onMouseEnter={() => setShowTooltip?.(true)}
              onMouseLeave={() => setShowTooltip?.(false)}
            >
              <StatusIcon
                status={mapToMarketDataStatus(titanService.status)}
                size="large"
                showTooltip={false}
              />
              {showTooltip && (
                <div
                  className={styles.tooltip}
                  style={{
                    backgroundColor: getStatusColor?.(titanService.status),
                  }}
                >
                  Success
                  <div
                    className={styles.tooltipArrow}
                    style={{
                      borderTopColor: getStatusColor?.(titanService.status),
                    }}
                  ></div>
                </div>
              )}
            </div>
            <h3 className={styles.bubbleTitle}>TITAN</h3>
          </div>

          <div className={styles.titleSection}>
            <h1 className={styles.glassTitle}>{translation('dashboard.title')}</h1>
          </div>

          <div className={styles.dateSection}>
            <span className={styles.lastUpdateValue}>
              {titanService.lastCheck.toLocaleDateString(
                locale === 'fr'
                  ? 'fr-FR'
                  : locale === 'es'
                    ? 'es-ES'
                    : locale === 'pt'
                      ? 'pt-BR'
                      : locale === 'it'
                        ? 'it-IT'
                        : 'en-US',
              )}{' '}
              à{' '}
              {titanService.lastCheck.toLocaleTimeString(
                locale === 'fr'
                  ? 'fr-FR'
                  : locale === 'es'
                    ? 'es-ES'
                    : locale === 'pt'
                      ? 'pt-BR'
                      : locale === 'it'
                        ? 'it-IT'
                        : 'en-US',
              )}
            </span>
          </div>

          <LanguageSwitcher />
        </div>
      )}

      <div className={styles.filtersBar}>
        <div className={styles.filtersLeft}>
          <MultiSelect
            options={companyNames.map((n) => ({ value: n, label: n }))}
            value={selectedCompanies}
            onChange={(values) => {
              setSelectedCompanies(values);
              setCurrentPage(1);
            }}
            placeholder={translation('filters.allCompanies')}
            horsContractList={horsContractList}
            onHorsContratChange={(value) => {
              setShowHorsContrat(value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className={styles.filtersRight}>
          <label className={styles.label}>
            <select
              className={styles.select}
              value={sortKey}
              onChange={(e) => {
                const value = e.target.value;
                if (isValidTableSortKey(value)) {
                  setSortKey(value);
                  setCurrentPage(1);
                }
              }}
            >
              <option value="name">{translation('filters.name')}</option>
              <option value="status">{translation('filters.status')}</option>
              <option value="date">{translation('filters.date')}</option>
            </select>
          </label>
          <button
            type="button"
            className={styles.sortButton}
            onClick={() => setSortDir((o) => (o === 'asc' ? 'desc' : 'asc'))}
            aria-label={translation('filters.changeOrder')}
            title={
              sortDir === 'asc'
                ? translation('filters.ascending')
                : translation('filters.descending')
            }
          >
            {sortDir === 'asc' ? '▲' : '▼'}
          </button>
          <button
            type="button"
            className={styles.sortButton}
            onClick={() => {
              setSelectedCompanies([]);
              setSortKey('date');
              setSortDir('desc');
              setShowHorsContrat(false);
              setCurrentPage(1);
            }}
            aria-label={translation('filters.resetFilters')}
            title={translation('filters.resetFilters')}
          >
            {translation('filters.reset')}
          </button>
        </div>
      </div>
      <table className={styles.statusTable}>
        <thead>
          <tr>
            <th>{translation('table.status')}</th>
            <th>{translation('table.enterprise')}</th>
            <th>{translation('table.lastUpdate')}</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className={styles.emptyRow}>
              <td colSpan={3} className={styles.emptyMessage}>
                Rechargement des données...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr className={styles.emptyRow}>
              <td colSpan={3} className={styles.emptyMessage}>
                {translation('table.noCompanies')}
              </td>
            </tr>
          ) : (
            paginatedRows.map((enterprise) => {
              const isHorsContrat = horsContractList.includes(enterprise.name.toLowerCase());

              return (
                <tr key={enterprise.id}>
                  <td className={styles.statusCell}>
                    <StatusIcon status={enterprise.marketDataStatus} size="large" />
                  </td>
                  <td className={styles.serviceName}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span
                          onClick={() => {
                            setSelectedEnterprise(enterprise);
                            setIsModalOpen(true);
                          }}
                          onMouseDown={(e) => e.preventDefault()}
                          style={{
                            cursor: 'pointer',
                            userSelect: 'none',
                            transition: 'color 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#007acc';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'inherit';
                          }}
                        >
                          {enterprise.name}
                        </span>
                        {isHorsContrat && (
                          <NoContractIcon
                            width={16}
                            height={16}
                            className={styles.noContractIcon}
                          />
                        )}
                      </div>
                      <span className={styles.operationsCount}>
                        ({enterprise.totalOperations} {translation('table.operationsCount')})
                      </span>
                    </div>
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

      {rows.length > 0 && (
        <div className={styles.paginationWrapper}>
          <div className={styles.paginationBar}>
            <button
              type="button"
              className={styles.pageButton}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label={translation('pagination.previousPage')}
              title={translation('pagination.previousPage')}
            >
              {translation('pagination.previous')}
            </button>
            <span className={styles.pageInfo}>
              {translation('pagination.page')} {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              className={styles.pageButton}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label={translation('pagination.nextPage')}
              title={translation('pagination.nextPage')}
            >
              {translation('pagination.next')}
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEnterprise(null);
        }}
        title={`${translation('modal.operationDetails')} - ${selectedEnterprise?.name || ''}`}
      >
        {selectedEnterprise && (
          <div>
            <div
              style={{
                marginBottom: '20px',
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
              }}
            >
              <p>
                <strong>{translation('modal.totalOperations')}</strong>
                {selectedEnterprise.totalOperations}
              </p>
              <p>
                <strong>{translation('table.status')}:</strong>{' '}
                {selectedEnterprise.marketDataStatus}
              </p>
              <p>
                <strong>{translation('table.lastUpdate')}:</strong>
                {formatUpdateDate(selectedEnterprise.lastMarketDataUpdate)}
              </p>
            </div>

            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#f1f3f4' }}>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      border: '1px solid #ddd',
                    }}
                  >
                    #
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      border: '1px solid #ddd',
                    }}
                  >
                    {translation('modal.operationType')}
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      border: '1px solid #ddd',
                    }}
                  >
                    {translation('modal.currency1')}
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      border: '1px solid #ddd',
                    }}
                  >
                    {translation('modal.currency2')}
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      border: '1px solid #ddd',
                    }}
                  >
                    {translation('modal.recoveryType')}
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      border: '1px solid #ddd',
                    }}
                  >
                    {translation('modal.lastUpdate')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedEnterprise.operations.map((operation, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9',
                    }}
                  >
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{index + 1}</td>
                    <td
                      style={{
                        padding: '10px',
                        border: '1px solid #ddd',
                        fontWeight: 'bold',
                      }}
                    >
                      {operation.operationType}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      {operation.devise1}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      {operation.devise2 || '-'}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      {operation.typeRecuperation}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      {formatUpdateDate(operation.lastMarketDataUpdate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StatusTable;
