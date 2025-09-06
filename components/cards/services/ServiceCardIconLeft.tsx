

import React from 'react';
import Editable from '@/components/Editable';

export const ServiceCardIconLeft: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div style={style} className="p-6 rounded-lg flex items-start space-x-4 text-left">
        <Editable sectionId={sectionId} elementId={`service-${item.id}-icon`} className="mt-1" />
        <div>
            <Editable sectionId={sectionId} elementId={`service-${item.id}-title`} as="h3" className="text-xl font-semibold text-gray-900 mb-2" />
            <Editable sectionId={sectionId} elementId={`service-${item.id}-text`} as="p" className="text-gray-600" />
        </div>
    </div>
);