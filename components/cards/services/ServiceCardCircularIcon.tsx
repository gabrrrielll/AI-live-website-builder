

import React from 'react';
import Editable from '@/components/Editable';

export const ServiceCardCircularIcon: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div style={style} className="p-8 rounded-lg text-center h-full">
        <div className="w-20 h-20 bg-[#c29a47]/10 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Editable sectionId={sectionId} elementId={`service-${item.id}-icon`} />
        </div>
        <Editable sectionId={sectionId} elementId={`service-${item.id}-title`} as="h3" className="text-xl font-semibold text-gray-900 mb-2" />
        <Editable sectionId={sectionId} elementId={`service-${item.id}-text`} as="p" className="text-gray-600" />
    </div>
);