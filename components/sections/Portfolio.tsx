"use client";

import React from 'react';
import { useSite } from '@/context/SiteContext';
import Editable from '@/components/Editable';
import { portfolioTemplateMap } from '@/components/cards/templateMaps';
import { PortfolioCardDefault } from '@/components/cards/portfolio';
import { ConditionalAnimation } from '@/components/animations/ConditionalAnimation';

interface PortfolioProps {
    sectionId: string;
}

export const Portfolio: React.FC<PortfolioProps> = ({ sectionId }) => {
    const { siteConfig } = useSite();
    const section = siteConfig?.sections[sectionId];
    if (!section) return null;

    const { items = [], layout = { template: 'default', itemCount: 6, carousel: false }, cardStyles } = section;
    const CardComponent = portfolioTemplateMap[layout.template as keyof typeof portfolioTemplateMap] || PortfolioCardDefault;

    const renderCarousel = () => (
        <div className="scrolling-container">
            <div className="scrolling-wrapper">
                {[...items, ...items].map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex-shrink-0 w-[90vw] sm:w-[45vw] lg:w-[30vw] px-4">
                        <div className="h-96">
                            <CardComponent sectionId={sectionId} item={item} style={cardStyles} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderGrid = () => {
        const gridColsOptions: { [key: number]: string } = {
            1: 'grid-cols-1 max-w-lg mx-auto', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4',
            5: 'grid-cols-5', 6: 'grid-cols-3', 7: 'grid-cols-4', 8: 'grid-cols-4', 9: 'grid-cols-3',
        };
        const gridCols = `md:${gridColsOptions[layout.itemCount as number] || 'grid-cols-3'}`;
        return (
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-8`}>
                {items.map(item => (
                    <div key={item.id} className="h-96">
                        <CardComponent sectionId={sectionId} item={item} style={cardStyles} />
                    </div>
                ))}
            </div>
        );
    };

    const useCarousel = layout.carousel && items.length > 3;

    return (
        <section className="py-20">
            <div className={`container mx-auto ${useCarousel ? 'px-0 max-w-full' : 'px-6'}`}>
                <div className={`${useCarousel ? 'px-6' : ''}`}>
                    <div className="text-center title-underline">
                        <Editable as="h2" sectionId={sectionId} elementId="portfolio-title" className="text-4xl font-bold text-gray-800" />
                    </div>
                    <Editable as="div" sectionId={sectionId} elementId="portfolio-subtitle" className="text-lg text-gray-600 max-w-3xl mx-auto mb-16 text-center" />
                </div>
                {useCarousel ? renderCarousel() : renderGrid()}
            </div>
        </section>
    );
};