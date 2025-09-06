import ArticlePageClient from './ArticlePageClient';

// Funcție simplificată pentru generarea parametrilor statici (opțională fără output: export)
export async function generateStaticParams() {
    // Fără output: 'export', această funcție este opțională
    // Next.js va folosi SSR pentru slug-uri necunoscute
    return [];
}

// Server-side component pentru încărcarea inițială
export default async function ArticlePage({ params }: { params: { slug: string } }) {
    const { slug } = params;

    // Fără output: 'export', toate slug-urile sunt gestionate dinamic
    // Folosim client-side loading pentru toate articolele
    return <ArticlePageClient article={null} siteConfig={null} slug={slug} />;
}