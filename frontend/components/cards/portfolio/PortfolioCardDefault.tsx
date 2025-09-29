import React from 'react';
import Editable from '@/components/Editable';

export const PortfolioCardDefault: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div className="group overflow-hidden rounded-lg relative h-full w-full" style={style}>
        <Editable
            sectionId={sectionId}
            elementId={`portfolio-${item.id}-image`}
            as="img"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
    </div>
);