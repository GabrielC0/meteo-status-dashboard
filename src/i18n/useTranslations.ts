'use client';

import { useIntl } from 'react-intl';

import { MessageKey } from './messages';

export const useTranslations = () => {
  const intl = useIntl();

  const translation = (key: MessageKey, values?: Record<string, string | number>) => {
    return intl.formatMessage({ id: key }, values);
  };

  return { translation };
};
