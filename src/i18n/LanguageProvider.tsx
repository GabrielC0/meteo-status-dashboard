"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { IntlProvider } from "react-intl";
import { messages, Locale } from "./messages";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [locale, setLocale] = useState<Locale>("fr");

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale;
    if (savedLocale && ["en", "fr", "es", "pt", "it"].includes(savedLocale)) {
      setLocale(savedLocale);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("locale", locale);
  }, [locale]);

  const contextValue: LanguageContextType = {
    locale,
    setLocale,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      <IntlProvider
        locale={locale}
        messages={messages[locale]}
        defaultLocale="fr"
      >
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};
