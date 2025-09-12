import type { SiteConfig, Section } from '../types';
import { createDefaultCardElements } from './elementFactory';

const getElementPrefix = (component: string): string => {
    switch (component) {
        case 'Services': return 'service';
        case 'Stats': return 'stat';
        case 'Team': return 'team-member';
        case 'Testimonials': return 'testimonial';
        case 'Blog': return 'post';
        case 'HowItWorks': return 'how-it-works-step';
        case 'Pricing': return 'plan';
        case 'Portfolio': return 'portfolio';
        case 'Clients': return 'client';
        default: return component.toLowerCase().replace(/\s+/g, '-');
    }
};

export const modifyLayout = (
    config: SiteConfig,
    sectionId: string,
    layoutChanges: Partial<Section['layout']>,
    cardStylesChanges?: Section['cardStyles']
): SiteConfig => {
    const newConfig = JSON.parse(JSON.stringify(config)); // Deep copy to avoid mutation
    const section = newConfig.sections[sectionId];
    if (!section) return newConfig;

    const oldLayout = section.layout || {};
    const newLayout = { ...oldLayout, ...layoutChanges };

    // Handle item count changes if itemCount is part of the update
    if (layoutChanges && layoutChanges.itemCount !== undefined && layoutChanges.itemCount !== (oldLayout.itemCount || 0)) {
        // For Blog section, just update the itemCount without creating/deleting items
        if (section.component === 'Blog') {
            // Blog uses global articles, so we only update the itemCount
            section.layout = newLayout;
            if (cardStylesChanges !== undefined) {
                section.cardStyles = { ...(section.cardStyles || {}), ...cardStylesChanges };
            }
            return newConfig;
        }

        const currentItems = section.items || [];
        const currentItemCount = currentItems.length;
        const newItemCount = layoutChanges.itemCount;

        if (newItemCount > currentItemCount) {
            const newItems = [...currentItems];
            const highestId = currentItems.reduce((maxId: number, item: any) => Math.max(item.id, maxId), 0);
            for (let i = 0; i < newItemCount - currentItemCount; i++) {
                const newId = highestId + i + 1;
                newItems.push({ id: newId });
                const defaultElements = createDefaultCardElements(section.component, newId);
                Object.assign(section.elements, defaultElements);
            }
            section.items = newItems;
        } else if (newItemCount < currentItemCount) {
            const itemsToRemove = currentItems.slice(newItemCount);
            section.items = currentItems.slice(0, newItemCount);
            const elementPrefix = getElementPrefix(section.component);
            itemsToRemove.forEach((item: any) => {
                Object.keys(section.elements).forEach(key => {
                    if (key.startsWith(`${elementPrefix}-${item.id}`)) {
                        delete section.elements[key];
                    }
                });
            });
        }
    }

    section.layout = newLayout;
    if (cardStylesChanges !== undefined) {
        section.cardStyles = { ...(section.cardStyles || {}), ...cardStylesChanges };
    }

    return newConfig;
};

export const duplicateSectionInConfig = (
    config: SiteConfig,
    sectionId: string // This is the ID of the section to clone, e.g., 'about' or 'about-clone-123'
): SiteConfig => {
    const originalSection = config.sections[sectionId];
    if (!originalSection) return config;

    const newConfig = JSON.parse(JSON.stringify(config)); // Deep copy

    // 1. Create new unique section ID
    const baseComponent = originalSection.component.toLowerCase();
    const newSectionId = `${baseComponent}-clone-${Date.now()}`;

    // 2. Clone the section object itself
    const newSection = JSON.parse(JSON.stringify(originalSection));
    newSection.id = newSectionId;

    // 3. Update element IDs within the new section
    const newElements: { [key: string]: any } = {};
    const originalIdToReplace = sectionId; // The ID of the section we are cloning

    Object.entries(newSection.elements).forEach(([key, value]) => {
        // Replace the ID of the cloned section with the new ID
        const newKey = key.replace(originalIdToReplace, newSectionId);
        newElements[newKey] = value;
    });
    newSection.elements = newElements;

    // 4. Insert into sectionOrder
    const originalIndex = newConfig.sectionOrder.indexOf(sectionId);
    newConfig.sectionOrder.splice(originalIndex + 1, 0, newSectionId);

    // 5. Add to sections dictionary
    newConfig.sections[newSectionId] = newSection;

    return newConfig;
};