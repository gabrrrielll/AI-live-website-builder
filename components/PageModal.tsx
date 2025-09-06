"use client";

import React, { useMemo } from 'react';
import { useSite } from '@/context/SiteContext';
import { X } from 'lucide-react';
import Editable from '@/components/Editable';

const PageModal: React.FC = () => {
  const { siteConfig, viewingPageId, closePage } = useSite();

  const page = useMemo(() => {
    if (!viewingPageId || !siteConfig?.pages) return null;
    return siteConfig.pages[viewingPageId];
  }, [viewingPageId, siteConfig]);

  if (!page) return null;
  
  const titleElementId = Object.keys(page.elements).find(key => key.endsWith('-title'));
  const contentElementId = Object.keys(page.elements).find(key => key.endsWith('-content'));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 pb-28" onClick={closePage}>
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-full flex flex-col transform transition-all" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
            {titleElementId ? (
                <Editable sectionId={page.id} as="h2" elementId={titleElementId} className="text-2xl font-semibold text-gray-800" />
            ) : <h2 className="text-2xl font-semibold text-gray-800">Page</h2> }
          
          <button onClick={closePage} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 md:p-8 flex-grow overflow-y-auto text-gray-800">
          {contentElementId ? (
              <Editable sectionId={page.id} as="div" elementId={contentElementId} />
          ) : <p>No content found for this page.</p> }
        </div>
      </div>
    </div>
  );
};

export default PageModal;