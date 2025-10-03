import { useAppSelector, useAppDispatch, getCurrentLocale, setLocale } from '@/stores';
import type { Locale } from '@/i18n/messages';

export const useLanguage = () => {
  const dispatch = useAppDispatch();
  const locale = useAppSelector(getCurrentLocale);

  const changeLocale = (newLocale: Locale) => {
    dispatch(setLocale(newLocale));
  };

  return {
    locale,
    setLocale: changeLocale,
  };
};
