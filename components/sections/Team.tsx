"use client";

import React from 'react';
import { useSite } from '@/context/SiteContext';
import Editable from '@/components/Editable';
import { teamTemplateMap } from '@/components/cards/templateMaps';
import { TeamCardDefault } from '@/components/cards/team';

interface TeamProps {
    sectionId: string;
}

export const Team: React.FC<TeamProps> = ({ sectionId }) => {
    const { siteConfig } = useSite();
    const section = siteConfig?.sections[sectionId];
    if (!section) return null;

    const { items = [], layout = { template: 'default', itemCount: 3 }, cardStyles } = section;
    const CardComponent = teamTemplateMap[layout.template as keyof typeof teamTemplateMap] || TeamCardDefault;

    // Equitable & Responsive Grid Logic using Flexbox
    const itemCount = items.length;
    let widthClass = 'lg:w-1/4'; // Default for 4 columns (for 4, 7, 8, 10, 11, 12 items)
    if (itemCount === 1) {
        widthClass = 'lg:w-full max-w-sm';
    } else if (itemCount === 2) {
        widthClass = 'lg:w-1/2';
    } else if (itemCount === 3 || itemCount === 5 || itemCount === 6 || itemCount === 9) {
        widthClass = 'lg:w-1/3';
    }

    return (
        <section className="py-20">
            <div className="container mx-auto px-6">
                <div className="text-center title-underline">
                    <Editable as="h2" sectionId={sectionId} elementId="team-title" className="text-4xl font-bold text-gray-800" />
                </div>
                <Editable as="div" sectionId={sectionId} elementId="team-subtitle" className="text-lg text-gray-600 max-w-3xl mx-auto mb-16 text-center" />
                <div className="flex flex-wrap justify-center -m-4">
                    {items.map(item => (
                       <div key={item.id} className={`w-full sm:w-1/2 p-4 ${widthClass}`}>
                         <CardComponent sectionId={sectionId} item={item} style={cardStyles} />
                       </div>
                    ))}
                </div>
            </div>
        </section>
    );
};