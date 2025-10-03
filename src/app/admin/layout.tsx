import type { Metadata } from 'next';

import { generateMetadata } from '@/components/layout/MetadataLayout';
import { RequireAuth } from '@/components/RequireAuth';
import type { LayoutProps } from '@/types/Layout.types';

export const metadata: Metadata = generateMetadata(
  'Administration',
  "Tableau de bord d'administration des statuts et données de marché.",
);

const AdminLayout = ({ children }: LayoutProps) => {
  return <RequireAuth>{children}</RequireAuth>;
};

export default AdminLayout;
