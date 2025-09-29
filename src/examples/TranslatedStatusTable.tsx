'use client';

import React from 'react';
import { useTranslations } from '@/i18n';
import { FormattedMessage } from 'react-intl';

export const TranslatedStatusTable: React.FC = () => {
  const { translation } = useTranslations();

  return (
    <div>
      <h1>{translation('dashboard.marketDataStatus')}</h1>

      <div>
        <h2>{translation('table.status')}</h2>
        <p>{translation('table.noCompanies')}</p>
      </div>

      <div>
        <label>{translation('filters.sortBy')}</label>
        <select>
          <option value="name">{translation('filters.name')}</option>
          <option value="status">{translation('filters.status')}</option>
          <option value="date">{translation('filters.date')}</option>
        </select>
      </div>

      <div>
        <button>{translation('filters.reset')}</button>
        <button>{translation('pagination.previous')}</button>
        <button>{translation('pagination.next')}</button>
      </div>

      <div>
        <FormattedMessage id="modal.operationDetails" />
        <FormattedMessage id="table.operationsCount" values={{ count: 5 }} />
      </div>
    </div>
  );
};
