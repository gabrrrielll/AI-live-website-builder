

import React from 'react';
import type { Article } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useSite } from '@/context/SiteContext';

interface BlogCardProps {
    article: Article;
    style?: React.CSSProperties;
}

export const BlogCardOverlay: React.FC<BlogCardProps> = ({ article, style }) => {
    const { language } = useLanguage();
    const { getImageUrl } = useSite();

    let imageUrl = article.imageUrl;
    if (imageUrl.startsWith('local-img-')) {
        imageUrl = getImageUrl(imageUrl) || '';
    }

    return (
        <div style={style} className="rounded-lg overflow-hidden group h-full relative text-white flex flex-col justify-end min-h-[300px] transition-shadow duration-300">
            <img src={imageUrl} alt={article.imageAlt[language]} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="p-6 z-10">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gray-100 transition-colors">{article.title[language]}</h3>
                <p className="text-gray-300 text-sm">{article.excerpt[language]}</p>
            </div>
        </div>
    );
};
