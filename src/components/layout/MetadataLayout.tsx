import { ReactNode } from 'react';
import type { Metadata } from 'next';

type MetadataLayoutProps = {
  children: ReactNode;
  title: string;
  description: string;
};

export const generateMetadata = (title: string, description: string): Metadata => ({
  title: `${title} | Météo Statuts`,
  description,
});

export const MetadataLayout = ({ children, title, description }: MetadataLayoutProps) => {
  return <>{children}</>;
};
