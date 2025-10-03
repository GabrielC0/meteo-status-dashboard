import type { MetadataRoute } from 'next';

const robots = (): MetadataRoute.Robots => {
  const baseUrl = 'https://example.com';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
};

export default robots;
