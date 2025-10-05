import type { Metadata } from 'next';

import { generateMetadata } from '@/lib/metadata';
import type { LayoutProps } from '@/types/Layout.types';

export const metadata: Metadata = generateMetadata(
  'Portal Client',
  'Consultez les statuts des services et la qualité des données en temps réel.',
);

const PortalLayout = ({ children }: LayoutProps) => {
  return <>{children}</>;
};

export default PortalLayout;
