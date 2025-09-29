import React, { ReactNode } from 'react';
import { SEO } from './SEO';

interface PageWrapperProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
    children: ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
    title,
    description,
    keywords,
    image,
    url,
    type,
    publishedTime,
    modifiedTime,
    author,
    section,
    tags,
    children
}) => {
    return (
        <>
            <SEO
                title={title}
                description={description}
                keywords={keywords}
                image={image}
                url={url}
                type={type}
                publishedTime={publishedTime}
                modifiedTime={modifiedTime}
                author={author}
                section={section}
                tags={tags}
            />
            {children}
        </>
    );
};

export default PageWrapper;


