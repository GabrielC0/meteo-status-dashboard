import type { Metadata } from 'next';

export const generateMetadata = (title: string, description: string): Metadata => ({
  title: `${title} | Météo Statuts`,
  description,
});
