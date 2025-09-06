

import React from 'react';
import Editable from '@/components/Editable';

export const TestimonialCardCenteredImage: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div style={style} className="p-8 rounded-lg text-center h-full flex flex-col justify-center">
        <Editable as="img" sectionId={sectionId} elementId={`testimonial-${item.id}-image`} className="w-24 h-24 rounded-full object-cover border-4 border-[#c29a47] mx-auto mb-6" />
        <Editable as="div" sectionId={sectionId} elementId={`testimonial-${item.id}-text`} className="text-gray-300 italic mb-4" />
        <Editable as="p" sectionId={sectionId} elementId={`testimonial-${item.id}-author`} className="font-semibold" />
    </div>
);