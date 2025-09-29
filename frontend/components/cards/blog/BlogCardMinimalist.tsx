

import React from 'react';
import type { Article } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface BlogCardProps {
    article: Article;
    style?: React.CSSProperties;
}

export const BlogCardMinimalist: React.FC<BlogCardProps> = ({ article, style }) => {
    const { language } = useLanguage();

    return (
        <div style={style} className="rounded-lg group h-full p-6 border-t-4 border-[#c29a47] transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#c29a47] transition-colors">{article.title[language]}</h3>
            <p className="text-gray-600 text-sm">{article.excerpt[language]}</p>
        </div>
    );
};
