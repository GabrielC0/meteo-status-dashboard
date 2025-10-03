'use client';

import { IntlProvider } from 'react-intl';

import { useAppSelector, getCurrentLocale } from '@/stores';
import { messages } from '@/i18n/messages';

type IntlProviderProps = {
  children: React.ReactNode;
};

const getMessages = (locale: string) => {
  if (locale === 'en') return messages.en;
  if (locale === 'es') return messages.es;
  if (locale === 'pt') return messages.pt;
  if (locale === 'it') return messages.it;
  return messages.fr;
};

export const IntlProviderWrapper = ({ children }: IntlProviderProps) => {
  const locale = useAppSelector(getCurrentLocale);

  const currentLocale = locale || navigator?.language?.split('-')[0] || 'fr';

  return (
    <IntlProvider locale={currentLocale} messages={getMessages(currentLocale)} defaultLocale="fr">
      {children}
    </IntlProvider>
  );
};

IntlProviderWrapper.displayName = 'Components.IntlProviderWrapper';
