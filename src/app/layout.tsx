import './globals.css';
import { LanguageProvider } from '@/i18n';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import type { Metadata, Viewport } from 'next';
import { HtmlLangUpdater } from '@/components/layout';

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

export function reportWebVitals(_metric: unknown) {
  // Relais minimal des Web Vitals (pluggez ici un endpoint ou analytics)
  // console.log(metric);
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="fr">
      <body>
        <LanguageProvider>
          <HtmlLangUpdater />
          <ErrorBoundary>{children}</ErrorBoundary>
        </LanguageProvider>
      </body>
    </html>
  );
};

export default RootLayout;
