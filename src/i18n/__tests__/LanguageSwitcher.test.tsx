import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StoreProvider } from '@/stores';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

const renderWithProvider = () =>
  render(
    <StoreProvider>
      <LanguageSwitcher />
    </StoreProvider>,
  );

describe('LanguageSwitcher', () => {
  it('affiche la langue courante puis permet de changer', () => {
    renderWithProvider();

    expect(screen.getByRole('button')).toHaveTextContent('🇫🇷');

    fireEvent.click(screen.getByRole('button'));

    const englishItem = screen
      .getAllByRole('menuitemradio')
      .find((el) => el.textContent?.includes('🇬🇧'))!;
    fireEvent.click(englishItem);
    expect(screen.getByRole('button')).toHaveTextContent('🇬🇧');
  });
});
