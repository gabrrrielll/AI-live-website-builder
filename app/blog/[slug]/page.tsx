import ArticlePageClient from './ArticlePageClient';
import type { Metadata } from 'next';
import type { Article, SiteConfig } from '@/types';
import { APP_CONFIG, SITE_CONFIG_API_URL } from '@/constants.js';

// Pentru Client-Side Rendering - nu generăm parametri statici
// Articolele se încarcă dinamic din localStorage folosind ID-uri
export const dynamicParams = true; // Permite parametri dinamici
export const revalidate = 0; // Revalidează la fiecare request

// CSR complet - nu pre-generează pagini statice
export async function generateStaticParams(): Promise<{ slug: string }[]> {
    return []; // Array gol pentru CSR complet
}

// Generăm metadata pentru fiecare articol folosind ID-ul
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = params;

    if (typeof window !== 'undefined') {
        try {
            const localConfig = localStorage.getItem('site-config');
            if (localConfig) {
                const config = JSON.parse(localConfig);
                const article = config.articles?.find((a: Article) => a.slug === slug);
                const articleId = article?.id;

                if (articleId) {
                    const foundArticle = config.articles?.find((a: Article) => a.id === articleId);
                    if (foundArticle) {
                        return {
                            title: `${foundArticle.title} | AI Live Website Editor`,
                            description: foundArticle.excerpt || 'Articol din blog-ul nostru despre tehnologie și web design.',
                            robots: {
                                index: true,
                                follow: true,
                            },
                        };
                    }
                }
            }
        } catch (error) {
            console.warn('Eroare la generarea metadata:', error);
        }
    }

    return {
        title: `Articol Blog | AI Live Website Editor`,
        description: 'Articol din blog-ul nostru despre tehnologie și web design.',
        robots: {
            index: true,
            follow: true,
        },
    };
}

// Componenta principală - articolele se încarcă dinamic prin ArticlePageClient
export default function ArticlePage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    return <ArticlePageClient article={null} siteConfig={null} slug={slug} />;
}