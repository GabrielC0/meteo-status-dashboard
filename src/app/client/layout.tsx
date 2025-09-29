import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Espace Client | Météo Statuts',
  description: 'Vue synthétique des statuts TITAN et Market Data pour le client.',
};

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default ClientLayout;
