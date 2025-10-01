'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';

import { toLocale } from './localeUtils';
import { Locale, messages } from './messages';

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

type LanguageProviderProps = {
  children: React.ReactNode;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('fr');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale');
    const validatedLocale = toLocale(savedLocale, 'fr');

    setLocale(validatedLocale);
  }, []);

  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  const contextValue: LanguageContextType = {
    locale,
    setLocale,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      <IntlProvider locale={locale} messages={messages[locale]} defaultLocale="fr">
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};
