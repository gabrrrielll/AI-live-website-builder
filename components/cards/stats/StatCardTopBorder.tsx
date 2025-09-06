

import React from 'react';
import Editable from '@/components/Editable';
import { StatNumber } from './StatNumber';

export const StatCardTopBorder: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div className="p-6 rounded-lg border-t-4 border-[#c29a47]" style={style}>
        <Editable sectionId={sectionId} elementId={`stat-${item.id}-icon`} className="mb-4" />
        <StatNumber sectionId={sectionId} elementId={`stat-${item.id}-number`} />
        <Editable as="p" sectionId={sectionId} elementId={`stat-${item.id}-label`} className="text-gray-600 font-semibold tracking-widest uppercase text-sm mt-2" />
    </div>
);