import type { Metadata } from 'next';

import { generateMetadata } from '@/components/layout/MetadataLayout';
import type { LayoutProps } from '@/types/Layout.types';

export const metadata: Metadata = generateMetadata(
  'Connexion',
  'Connectez-vous à votre compte pour accéder au tableau de bord.',
);

const LoginLayout = ({ children }: LayoutProps) => {
  return <>{children}</>;
};

export default LoginLayout;
