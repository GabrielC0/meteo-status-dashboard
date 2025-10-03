export type SupportedLocale = 'en' | 'fr' | 'es' | 'pt' | 'it';

export const SUPPORTED_LOCALES: readonly SupportedLocale[] = ['en', 'fr', 'es', 'pt', 'it'];

export type LanguageConfig = {
  readonly code: SupportedLocale;
  readonly flag: string;
  readonly name: string;
};

export const LANGUAGES: readonly LanguageConfig[] = [
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'pt', flag: '🇧🇷', name: 'Português' },
  { code: 'it', flag: '🇮🇹', name: 'Italiano' },
];
