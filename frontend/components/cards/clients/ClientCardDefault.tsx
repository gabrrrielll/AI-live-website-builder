import React from 'react';
import Editable from '@/components/Editable';

export const ClientCardDefault: React.FC<{ sectionId: string, item: { id: number }, style?: React.CSSProperties }> = ({ sectionId, item, style }) => (
    <div className="client-logo flex justify-center p-4" style={style}>
        <Editable 
            sectionId={sectionId}
            elementId={`client-${item.id}-logo`} 
            as="img" 
            className="max-h-12"
        />
    </div>
);