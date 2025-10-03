export { store } from './store';
export type { RootState, AppDispatch } from './store';

export { useAppSelector, useAppDispatch } from './hooks';

export { default as StoreProvider } from './StoreProvider';

export {
  fetchTitanData,
  clearTitanData,
  getTitanCompanies,
  getTitanSessions,
  getTitanTicketsStats,
  getTitanIsLoading,
  getTitanError,
} from './titanSlice';

export { setLocale, clearLanguageData, getCurrentLocale } from './languageSlice';
