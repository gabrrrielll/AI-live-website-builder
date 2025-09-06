

import React from 'react';
import Editable from '@/components/Editable';

export const TestimonialCardModern: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div style={style} className="p-8 rounded-lg h-full text-left relative overflow-hidden flex flex-col">
        <Editable sectionId={sectionId} elementId="testimonials-quote-icon" className="absolute top-4 right-4 text-blue-800/50" />
        <Editable as="div" sectionId={sectionId} elementId={`testimonial-${item.id}-text`} className="text-gray-300 mb-6 flex-grow" />
        <div className="flex items-center space-x-4 mt-auto">
            <Editable as="img" sectionId={sectionId} elementId={`testimonial-${item.id}-image`} className="w-12 h-12 rounded-full object-cover" />
            <Editable as="p" sectionId={sectionId} elementId={`testimonial-${item.id}-author`} className="font-semibold" />
        </div>
    </div>
);