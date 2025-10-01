import type { Metadata, Viewport } from 'next';

import { LanguageProvider } from '@/i18n';
import { StoreProvider } from '@/stores';

import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { HtmlLangUpdater } from '@/components/layout';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Météo Statuts | Tableau de bord',
    template: '%s | Météo Statuts',
  },
  description:
    'Tableau de bord des statuts des services et données de marché, avec i18n et accessibilité.',
  icons: { icon: '/favicon.ico' },
  applicationName: 'Météo Statuts',
  metadataBase: new URL('https://example.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Météo Statuts | Tableau de bord',
    description: "Suivez l'état des services et la qualité des données de marché en temps réel.",
    url: 'https://example.com/',
    siteName: 'Météo Statuts',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Météo Statuts | Tableau de bord',
    description: "Suivez l'état des services et la qualité des données de marché en temps réel.",
  },
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
};

export function reportWebVitals(_metric: unknown) {}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="fr">
      <body>
        <StoreProvider>
          <LanguageProvider>
            <HtmlLangUpdater />
            <ErrorBoundary>{children}</ErrorBoundary>
          </LanguageProvider>
        </StoreProvider>
      </body>
    </html>
  );
};

export default RootLayout;
