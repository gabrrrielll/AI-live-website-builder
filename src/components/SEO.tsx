import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
}

export const SEO: React.FC<SEOProps> = ({
    title = 'AI-Powered Live Website Editor',
    description = 'An interactive website builder that allows for real-time, in-browser editing of text and images. All changes are saved locally, with AI-powered content generation features to assist in creation.',
    keywords = 'website builder, AI, live editor, web design, real-time editing',
    image = 'https://picsum.photos/seed/og-image/1200/630',
    url = 'https://yourdomain.com',
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = []
}) => {
    const fullTitle = title.includes('AI-Powered') ? title : `${title} | AI-Powered Live Website Editor`;
    const fullUrl = url.startsWith('http') ? url : `https://yourdomain.com${url}`;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="robots" content="index, follow" />
            <meta name="author" content={author || 'AI Website Editor'} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:site_name" content="AI-Powered Live Website Editor" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Article specific meta tags */}
            {type === 'article' && publishedTime && (
                <meta property="article:published_time" content={publishedTime} />
            )}
            {type === 'article' && modifiedTime && (
                <meta property="article:modified_time" content={modifiedTime} />
            )}
            {type === 'article' && author && (
                <meta property="article:author" content={author} />
            )}
            {type === 'article' && section && (
                <meta property="article:section" content={section} />
            )}
            {type === 'article' && tags.map((tag, index) => (
                <meta key={index} property="article:tag" content={tag} />
            ))}

            {/* Canonical URL */}
            <link rel="canonical" href={fullUrl} />

            {/* Additional meta tags */}
            <meta name="theme-color" content="#c29a47" />
            <meta name="msapplication-TileColor" content="#c29a47" />
        </Helmet>
    );
};

export default SEO;


