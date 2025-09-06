

import React from 'react';
import type { Article } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useSite } from '@/context/SiteContext';

interface BlogCardProps {
    article: Article;
    style?: React.CSSProperties;
}

export const BlogCardImageLeft: React.FC<BlogCardProps> = ({ article, style }) => {
    const { language } = useLanguage();
    const { getImageUrl } = useSite();

    let imageUrl = article.imageUrl;
    if (imageUrl.startsWith('local-img-')) {
        imageUrl = getImageUrl(imageUrl) || '';
    }

    return (
        <div style={style} className="rounded-lg overflow-hidden group h-full flex flex-col md:flex-row transition-shadow duration-300">
            <div className="md:w-1/3 overflow-hidden flex-shrink-0">
                <img src={imageUrl} alt={article.imageAlt[language]} className="w-full h-48 md:h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="p-6 flex flex-col flex-grow justify-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#c29a47] transition-colors">{article.title[language]}</h3>
                <p className="text-gray-600 text-sm">{article.excerpt[language]}</p>
            </div>
        </div>
    );
};
