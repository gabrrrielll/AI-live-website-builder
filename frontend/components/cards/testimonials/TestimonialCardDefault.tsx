

import React from 'react';
import Editable from '@/components/Editable';

export const TestimonialCardDefault: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div style={style} className="p-8 rounded-lg text-center h-full flex flex-col justify-center">
        <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, starIndex) => (
                <Editable key={starIndex} sectionId={sectionId} elementId="testimonials-star-icon" />
            ))}
        </div>
        <Editable sectionId={sectionId} elementId="testimonials-quote-icon" className="mx-auto mb-4" />
        <Editable as="div" sectionId={sectionId} elementId={`testimonial-${item.id}-text`} className="text-gray-300 italic mb-6" />
        <Editable as="p" sectionId={sectionId} elementId={`testimonial-${item.id}-author`} className="font-semibold" />
    </div>
);