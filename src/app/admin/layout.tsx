import type { Metadata } from 'next';

import { generateMetadata } from '@/lib/metadata';
import type { LayoutProps } from '@/types/Layout.types';

export const metadata: Metadata = generateMetadata(
  'Administration',
  "Tableau de bord d'administration des statuts et données de marché.",
);

const AdminLayout = ({ children }: LayoutProps) => {
  return <>{children}</>;
};

export default AdminLayout;
