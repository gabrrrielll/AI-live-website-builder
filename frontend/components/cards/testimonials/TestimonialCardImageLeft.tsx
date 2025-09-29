

import React from 'react';
import Editable from '@/components/Editable';

export const TestimonialCardImageLeft: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div style={style} className="p-8 rounded-lg text-left h-full flex items-center space-x-6">
        <Editable as="img" sectionId={sectionId} elementId={`testimonial-${item.id}-image`} className="w-24 h-24 rounded-full object-cover border-4 border-[#c29a47] flex-shrink-0" />
        <div className="flex-grow">
            <Editable as="div" sectionId={sectionId} elementId={`testimonial-${item.id}-text`} className="text-gray-300 italic mb-4" />
            <Editable as="p" sectionId={sectionId} elementId={`testimonial-${item.id}-author`} className="font-semibold" />
        </div>
    </div>
);