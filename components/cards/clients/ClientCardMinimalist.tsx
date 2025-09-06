import React from 'react';
import Editable from '@/components/Editable';

export const ClientCardMinimalist: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div className="flex justify-center p-4 opacity-70 hover:opacity-100 transition-opacity" style={style}>
        <Editable 
            sectionId={sectionId}
            elementId={`client-${item.id}-logo`} 
            as="img" 
            className="max-h-10"
        />
    </div>
);