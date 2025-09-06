

import React from 'react';
import Editable from '@/components/Editable';

export const TeamCardSocial: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div style={style} className="p-6 rounded-lg text-center h-full flex flex-col items-center">
        <Editable 
            sectionId={sectionId}
            elementId={`team-member-${item.id}-image`} 
            as="img"
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
        />
        <Editable sectionId={sectionId} elementId={`team-member-${item.id}-name`} as="h3" className="text-xl font-semibold text-gray-900" />
        <Editable sectionId={sectionId} elementId={`team-member-${item.id}-role`} as="p" className="text-[#c29a47] font-medium mb-4" />
        <Editable sectionId={sectionId} elementId={`team-member-${item.id}-socials`} as="div" className="team-socials mt-auto" />
    </div>
);