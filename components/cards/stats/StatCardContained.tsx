

import React from 'react';
import Editable from '@/components/Editable';
import { StatNumber } from './StatNumber';

export const StatCardContained: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div className="p-6 rounded-lg" style={style}>
        <div className="mb-4 flex justify-center">
            <Editable sectionId={sectionId} elementId={`stat-${item.id}-icon`} />
        </div>
        <StatNumber sectionId={sectionId} elementId={`stat-${item.id}-number`} />
        <Editable as="p" sectionId={sectionId} elementId={`stat-${item.id}-label`} className="text-gray-600 font-semibold tracking-widest uppercase text-sm mt-2" />
    </div>
);