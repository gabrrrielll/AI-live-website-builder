

import React from 'react';
import Editable from '@/components/Editable';

export const PortfolioCardOverlay: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div className="group overflow-hidden rounded-lg relative h-full flex flex-col justify-end text-white" style={style}>
        <Editable sectionId={sectionId} elementId={`portfolio-${item.id}-image`} as="img" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="p-4 z-10">
            <Editable as="p" sectionId={sectionId} elementId={`portfolio-${item.id}-category`} className="text-xs uppercase font-semibold text-gray-200" />
            <Editable as="h3" sectionId={sectionId} elementId={`portfolio-${item.id}-title`} className="text-lg font-bold" />
        </div>
    </div>
);