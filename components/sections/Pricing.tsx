"use client";

import React from 'react';
import { useSite } from '@/context/SiteContext';
import Editable from '@/components/Editable';
import { pricingTemplateMap } from '@/components/cards/templateMaps';
import { PricingCardDefault } from '@/components/cards/pricing';
import { ConditionalAnimation } from '@/components/animations/ConditionalAnimation';

interface PricingProps {
    sectionId: string;
}

export const Pricing: React.FC<PricingProps> = ({ sectionId }) => {
    const { siteConfig } = useSite();
    const section = siteConfig?.sections[sectionId];
    if (!section) return null;

    const { items = [], layout = { template: 'default', itemCount: 3 }, cardStyles } = section;
    const CardComponent = pricingTemplateMap[layout.template as keyof typeof pricingTemplateMap] || PricingCardDefault;

    const gridColsOptions: { [key: number]: string } = {
        1: 'grid-cols-1 max-w-sm mx-auto',
        2: 'md:grid-cols-2 max-w-2xl mx-auto',
        3: 'md:grid-cols-3',
        4: 'lg:grid-cols-4',
        5: 'lg:grid-cols-5',
    };
    const gridCols = gridColsOptions[layout.itemCount || 3] || 'md:grid-cols-3';

    return (
        <section className="py-20">
            <div className="container mx-auto px-6">
                <ConditionalAnimation sectionId={sectionId} direction="up" distance={60} delay={0.1}>
                    <div className="text-center title-underline">
                        <Editable as="h2" sectionId={sectionId} elementId="pricing-title" className="text-4xl font-bold text-gray-800" />
                    </div>
                </ConditionalAnimation>

                <ConditionalAnimation sectionId={sectionId} direction="up" distance={40} delay={0.2}>
                    <Editable as="div" sectionId={sectionId} elementId="pricing-subtitle" className="text-lg text-gray-600 max-w-3xl mx-auto mb-16 text-center" />
                </ConditionalAnimation>

                <div className={`grid grid-cols-1 ${gridCols} gap-8 items-stretch`}>
                    {items.map((item, index) => (
                        <ConditionalAnimation
                            key={item.id}
                            sectionId={sectionId}
                            direction="up"
                            distance={50}
                            delay={0.3 + (index * 0.1)}
                        >
                            <CardComponent sectionId={sectionId} item={item} style={cardStyles} />
                        </ConditionalAnimation>
                    ))}
                </div>
            </div>
        </section>
    );
};