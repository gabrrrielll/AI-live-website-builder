

import React from 'react';
import Editable from '@/components/Editable';

export const PortfolioCardHover: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div className="group overflow-hidden rounded-lg relative" style={style}>
        <Editable
            sectionId={sectionId}
            elementId={`portfolio-${item.id}-image`}
            as="img"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Editable as="h3" sectionId={sectionId} elementId={`portfolio-${item.id}-title`} className="text-white text-xl font-bold" />
        </div>
    </div>
);