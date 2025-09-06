

import React from 'react';
import Editable from '@/components/Editable';

export const TeamCardImageLeft: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div style={style} className="p-6 rounded-lg text-left flex items-center space-x-6">
        <Editable 
            sectionId={sectionId}
            elementId={`team-member-${item.id}-image`} 
            as="img"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md flex-shrink-0"
        />
        <div>
            <Editable sectionId={sectionId} elementId={`team-member-${item.id}-name`} as="h3" className="text-xl font-semibold text-gray-900" />
            <Editable sectionId={sectionId} elementId={`team-member-${item.id}-role`} as="p" className="text-[#c29a47] font-medium" />
        </div>
    </div>
);