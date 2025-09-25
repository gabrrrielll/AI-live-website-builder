"use client";

import React from 'react';
import { useSite } from '@/context/SiteContext';
import Editable from '@/components/Editable';
import { testimonialTemplateMap } from '@/components/cards/templateMaps';
import { TestimonialCardDefault } from '@/components/cards/testimonials';
import { ConditionalAnimation } from '@/components/animations/ConditionalAnimation';

interface TestimonialsProps {
    sectionId: string;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ sectionId }) => {
    const { siteConfig } = useSite();
    const section = siteConfig?.sections[sectionId];
    if (!section) return null;

    const { items = [], layout = { template: 'default', itemCount: 3 }, cardStyles } = section;
    const CardComponent = testimonialTemplateMap[layout.template as keyof typeof testimonialTemplateMap] || TestimonialCardDefault;

    const gridColsOptions: { [key: number]: string } = {
        1: 'md:grid-cols-1 max-w-2xl mx-auto',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-2 lg:grid-cols-4',
    };
    const gridCols = gridColsOptions[layout.itemCount || 3] || 'md:grid-cols-3';


    return (
        <section className="py-20">
            <div className="container mx-auto px-6">
                <ConditionalAnimation sectionId={sectionId} direction="up" distance={60} delay={0.1}>
                    <div className="text-center title-underline">
                        <Editable as="h2" sectionId={sectionId} elementId="testimonials-title" className="text-4xl font-bold" />
                    </div>
                </ConditionalAnimation>

                <div className={`grid grid-cols-1 ${gridCols} gap-8`}>
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