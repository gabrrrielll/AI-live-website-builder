import { Metadata } from 'next';
import { getSiteConfig } from '@/utils/siteConfigLoader';
import App from '@/App';

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();

  // Găsește secțiunea Hero pentru titlu și descriere
  const heroSection = siteConfig.sectionOrder
    .map(id => siteConfig.sections[id])
    .find(section => section?.component === 'Hero');

  // Extrage titlul și subtitlul din elementele Hero
  const heroTitleElement = heroSection?.elements?.['hero-title-1'] as any;
  const heroSubtitleElement = heroSection?.elements?.['hero-subtitle-1'] as any;

  const title = heroTitleElement?.content?.ro || 'AI Live Website Editor';
  const description = heroSubtitleElement?.content?.ro || 'Creează site-uri web moderne cu AI';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function HomePage() {
  return <App />;
}
