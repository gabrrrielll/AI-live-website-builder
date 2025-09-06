"use client";

import React from 'react';
import { useSite } from '@/context/SiteContext';
import Editable from '@/components/Editable';
import { statsTemplateMap } from '@/components/cards/templateMaps';
import { StatCardDefault } from '@/components/cards/stats';

interface StatsProps {
    sectionId: string;
}

export const Stats: React.FC<StatsProps> = ({ sectionId }) => {
    const { siteConfig } = useSite();
    const section = siteConfig?.sections[sectionId];
    if (!section) return null;

    const { items = [], layout = { template: 'default', itemCount: 3 }, cardStyles } = section;
    const CardComponent = statsTemplateMap[layout.template as keyof typeof statsTemplateMap] || StatCardDefault;
    
    const gridColsOptions: { [key: number]: string } = {
        1: 'grid-cols-1 max-w-xs mx-auto',
        2: 'sm:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4',
        5: 'lg:grid-cols-5',
    };
    const gridCols = gridColsOptions[layout.itemCount] || 'md:grid-cols-3';

    return (
        <section className="py-20">
            <div className="container mx-auto px-6">
                <div className="text-center title-underline">
                    <Editable as="h2" sectionId={sectionId} elementId="stats-title" className="text-4xl font-bold text-gray-800" />
                </div>
                <div className={`grid grid-cols-1 ${gridCols} gap-8 text-center`}>
                    {items.map((item) => (
                        <CardComponent key={item.id} sectionId={sectionId} item={item} style={cardStyles} />
                    ))}
                </div>
            </div>
        </section>
    );
};