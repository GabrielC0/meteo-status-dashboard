import type { Locale } from './messages';

export const SUPPORTED_LOCALES = ['en', 'fr', 'es', 'pt', 'it'] as const;

export function isValidLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function toLocale(value: string | null, fallback: Locale = 'fr'): Locale {
  if (!value) {
    return fallback;
  }

  if (isValidLocale(value)) {
    return value;
  }

  return fallback;
}

export type LanguageConfig = {
  readonly code: Locale;
  readonly flag: string;
  readonly name: string;
};

export const LANGUAGES: readonly LanguageConfig[] = [
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'pt', flag: '🇧🇷', name: 'Português' },
  { code: 'it', flag: '🇮🇹', name: 'Italiano' },
] as const;
