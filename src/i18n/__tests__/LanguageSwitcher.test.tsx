import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider } from '@/i18n';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

const renderWithProvider = () =>
  render(
    <LanguageProvider>
      <LanguageSwitcher />
    </LanguageProvider>,
  );

describe('LanguageSwitcher', () => {
  it('affiche la langue courante puis permet de changer', () => {
    renderWithProvider();

    // bouton principal avec drapeau FR par défaut
    expect(screen.getByRole('button')).toHaveTextContent('🇫🇷');

    // ouvre la liste
    fireEvent.click(screen.getByRole('button'));

    // clique sur English (élément de menu role=menuitemradio)
    const englishItem = screen
      .getAllByRole('menuitemradio')
      .find((el) => el.textContent?.includes('🇬🇧'))!;
    fireEvent.click(englishItem);

    // le drapeau courant devient 🇬🇧
    expect(screen.getByRole('button')).toHaveTextContent('🇬🇧');
  });
});
