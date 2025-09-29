import "./globals.css";
import { LanguageProvider } from "@/i18n";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="fr">
      <body>
        <LanguageProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </LanguageProvider>
      </body>
    </html>
  );
};

export default RootLayout;
