import "./globals.css";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
