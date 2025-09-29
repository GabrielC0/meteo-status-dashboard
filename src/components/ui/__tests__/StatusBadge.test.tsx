import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusBadge from '../StatusBadge';
import { LanguageProvider } from '@/i18n';

describe('StatusBadge', () => {
  it('affiche le texte pour SUCCESS par défaut', () => {
    render(
      <LanguageProvider>
        <StatusBadge status="SUCCESS" />
      </LanguageProvider>,
    );
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it("n'affiche pas le texte quand showText=false", () => {
    render(
      <LanguageProvider>
        <StatusBadge status="SUCCESS" showText={false} />
      </LanguageProvider>,
    );
    expect(screen.queryByText('Success')).toBeNull();
  });
});
