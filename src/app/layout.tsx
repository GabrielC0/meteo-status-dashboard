import type { Metadata, Viewport } from 'next';

import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { IntlProviderWrapper } from '@/components/IntlProvider';

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

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="fr">
      <body>
        <IntlProviderWrapper>
          <ErrorBoundary>{children}</ErrorBoundary>
        </IntlProviderWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
