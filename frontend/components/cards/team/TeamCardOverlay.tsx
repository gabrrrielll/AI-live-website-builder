

import React from 'react';
import Editable from '@/components/Editable';

export const TeamCardOverlay: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div className="group overflow-hidden rounded-lg relative h-full aspect-square" style={style}>
        <Editable
            sectionId={sectionId}
            elementId={`team-member-${item.id}-image`}
            as="img"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end text-white p-4">
            <Editable as="h3" sectionId={sectionId} elementId={`team-member-${item.id}-name`} className="text-lg font-bold" />
            <Editable as="p" sectionId={sectionId} elementId={`team-member-${item.id}-role`} className="text-sm" />
        </div>
    </div>
);