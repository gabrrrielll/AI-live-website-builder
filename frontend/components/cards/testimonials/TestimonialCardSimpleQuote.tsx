

import React from 'react';
import Editable from '@/components/Editable';

export const TestimonialCardSimpleQuote: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div style={style} className="p-8 h-full flex flex-col justify-center text-center rounded-lg">
        <Editable sectionId={sectionId} elementId="testimonials-quote-icon" className="mx-auto mb-4 text-[#c29a47]" />
        <Editable as="div" sectionId={sectionId} elementId={`testimonial-${item.id}-text`} className="text-xl text-gray-200 italic mb-6" />
        <Editable as="p" sectionId={sectionId} elementId={`testimonial-${item.id}-author`} className="font-semibold text-white tracking-wider uppercase" />
    </div>
);