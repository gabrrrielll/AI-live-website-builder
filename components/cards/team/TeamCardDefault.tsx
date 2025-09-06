

import React from 'react';
import Editable from '@/components/Editable';

export const TeamCardDefault: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div style={style} className="p-6 rounded-lg text-center">
        <Editable 
            sectionId={sectionId}
            elementId={`team-member-${item.id}-image`} 
            as="img"
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-md"
        />
        <Editable sectionId={sectionId} elementId={`team-member-${item.id}-name`} as="h3" className="text-xl font-semibold text-gray-900" />
        <Editable sectionId={sectionId} elementId={`team-member-${item.id}-role`} as="p" className="text-[#c29a47] font-medium" />
    </div>
);