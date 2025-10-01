'use client';

import { useEffect } from 'react';

import { useLanguage } from '@/i18n';

const HtmlLangUpdater = () => {
  const { locale } = useLanguage();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', locale);
    }
  }, [locale]);

  return null;
};

export default HtmlLangUpdater;
