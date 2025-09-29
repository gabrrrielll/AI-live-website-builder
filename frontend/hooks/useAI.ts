"use client";

import { useCallback } from 'react';
import { toast } from 'sonner';
import { generateTextWithRetry, generateImage } from '@/services/aiService';
import { sanitizeHTML } from '@/utils/sanitize';
import type { SiteConfig, RichTextElement, ImageElement, LogoElement } from '@/types';
import type { Translations } from '@/utils/translations';
import { searchUnsplashPhotos } from '@/services/unsplashService';
import { modifyLayout, duplicateSectionInConfig } from '@/utils/configModifiers';

interface useAIProps {
    siteConfig: SiteConfig | null;
    setSiteConfig: React.Dispatch<React.SetStateAction<SiteConfig | null>>;
    updateHistory: (newConfig: SiteConfig) => void;
    t: Translations;
    storeImage: (dataUrl: string) => Promise<string>;
}

type AICommand =
    | { command: 'update_element_content'; element_id: string; lang: 'ro' | 'en' | 'both'; content: any }
    | { command: 'update_element_style'; element_id: string; styles: React.CSSProperties }
    | { command: 'update_section_style'; section_id: string; styles: React.CSSProperties }
    | { command: 'update_section_layout'; section_id: string; layout: any }
    | { command: 'update_card_style'; section_id: string; cardStyles: any }
    | { command: 'update_image_element'; element_id: string; unsplash_query: string; alt_ro: string; alt_en: string }
    | { command: 'generate_image_element'; element_id: string; generation_prompt: string; alt_ro: string; alt_en: string; aspect_ratio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4' }
    | { command: 'update_background_image'; section_id: string; item_id: number | null; unsplash_query: string }
    | { command: 'set_section_visibility'; section_id: string; visible: boolean }
    | { command: 'reorder_sections'; order: string[] }
    | { command: 'update_map_element'; element_id: string; full_address: string }
    | { command: 'duplicate_section'; section_id: string }
    | { command: 'create_article'; title_ro: string; title_en: string; excerpt_ro: string; excerpt_en: string; content_ro: string; content_en: string; image_query: string; image_alt_ro: string; image_alt_en: string }
    | { command: 'explanation'; text: string };


// Helper function to find an element by its ID across all sections and pages
const findElement = (config: SiteConfig, elementId: string) => {
    for (const sectionId in config.sections) {
        if (config.sections[sectionId].elements[elementId]) {
            return { element: config.sections[sectionId].elements[elementId], section: config.sections[sectionId] };
        }
    }
    if (config.pages) {
        for (const pageId in config.pages) {
            if (config.pages[pageId].elements[elementId]) {
                return { element: config.pages[pageId].elements[elementId], section: null }; // Pages don't have a section context in the same way
            }
        }
    }
    return { element: null, section: null };
};


export const useAI = ({ siteConfig, setSiteConfig, updateHistory, t, storeImage }: useAIProps) => {

    const rebuildSiteWithAI = useCallback(async (
        userPrompt: string,
        onProgress: (progress: number, statusTextKey: string) => void
    ): Promise<string | undefined> => {
        if (!siteConfig) {
            toast.error("Site config not loaded yet.");
            return;
        }

        const systemPrompt = `You are an expert web designer and copywriter. Your task is to act as a command generator. Based on a user's prompt and the current website's JSON configuration, you will generate a series of commands to modify the site.

**CRITICAL RULES:**
1.  **JSON LINES FORMAT (JSONL):** Your output MUST be a series of JSON objects, one per line. Each line MUST be a complete, valid JSON object representing a single command.
2.  **NO ARRAY, NO MARKDOWN:** Do NOT wrap the entire output in a JSON array (\`[\`...\`]\`). Do NOT use markdown code blocks. Just output the raw JSON objects, each on a new line.
3.  **INCREMENTAL CHANGES:** Only generate commands for things that need to change based on the user's prompt. Do not generate commands for parts of the site that remain the same.
4.  **POPULATE NEW ITEMS:** When you use \`update_section_layout\` to increase \`itemCount\` (including for the FAQ section), you MUST follow up with \`update_element_content\` commands for ALL relevant elements of the NEWLY ADDED items (e.g., titles, texts, icons, questions, answers). Do not leave new items with default placeholder content.
5.  **VARY LAYOUTS (MANDATORY):** You are REQUIRED to use the \`update_section_layout\` command to choose different \`template\` values for sections like Services, Team, HowItWorks, Portfolio, etc. It is a failure to leave all sections on their default layout. You MUST create a visually diverse page by selecting various templates. This is not optional.
6.  **LOGO GENERATION (MANDATORY):** You MUST generate a logo for the website. Use the \`generate_image_element\` command for the \`header-logo\` element. The \`generation_prompt\` must be relevant to the user's request, and the \`aspect_ratio\` MUST be \`"16:9"\`. This is CRITICAL and cannot be skipped.
7.  **DUPLICATE 'ABOUT' SECTION:** You can duplicate the 'About' section to create more content blocks. Use the \`duplicate_section\` command. The \`section_id\` in the command should be the ID of the section you want to clone. The system will create a new unique ID for the cloned section automatically.
8.  **CREATE BLOG ARTICLES (MANDATORY MINIMUM):** You MUST create AT LEAST 3 blog articles using the \`create_article\` command. This is especially useful for businesses that need content marketing. The command requires title, excerpt, content, and image information for both Romanian and English languages. Create articles that are relevant to the user's business or website topic.
9.  **IMAGES (UNSPLASH OR AI GENERATION):** You have two options for images.
    -   **Unsplash:** For standard, realistic photos, use the \`update_image_element\` command. Provide a *specific and descriptive English* \`unsplash_query\`.
    -   **AI Generation:** For unique, stylized, or abstract images (like logos, custom icons, or artistic backgrounds), use the \`generate_image_element\` command. Provide a detailed English \`generation_prompt\`.
10. **ASPECT RATIO:** When using \`generate_image_element\`, you can optionally specify an \`aspect_ratio\`. Supported values are "1:1" (for squares like logos or profile pictures), "16:9" (landscape), "9:16" (portrait), "4:3", and "3:4". If omitted, it defaults to "16:9".
11. **UPDATE THE MAP:** For the contact map, you MUST use the \`update_map_element\` command and provide the \`full_address\`. Do not try to construct an \`<iframe>\` yourself.
12. **MULTILINGUAL CONTENT:** For text changes, use the \`update_element_content\` command. You MUST provide content for BOTH Romanian ('ro') and English ('en') by setting \`lang: 'both'\` and providing a content object like \`{ "ro": "...", "en": "..." }\`.
13. **EXPLANATION LAST (RAW HTML):** The VERY LAST line of your output MUST be an \`explanation\` command. The user-friendly summary MUST be written in correct Romanian and formatted with simple HTML. Place this raw HTML string directly in a "text" property.
14. **DO NOT BASE64 ENCODE:** The "text" property of the explanation command must contain the raw HTML string. DO NOT use Base64 encoding.
15. **CLEAN OUTPUT:** Ensure your entire response consists only of the JSONL command objects. Do not include any extra text, notes, or debugging information before, after, or between the JSON lines.
16. **MANDATORY REQUIREMENTS:** Your output MUST include: (1) At least one \`generate_image_element\` command for the header logo, (2) At least 3 \`create_article\` commands for blog content. These are non-negotiable requirements.

**AVAILABLE COMMAND FORMATS (as single-line JSON objects):**
-   To change text: \`{ "command": "update_element_content", "element_id": "hero-title-1", "lang": "both", "content": { "ro": "Titlu Nou", "en": "New Title" } }\`
-   To find a stock photo and update an image: \`{ "command": "update_image_element", "element_id": "about-image", "unsplash_query": "modern office", "alt_ro": "Birou modern", "alt_en": "Modern office" }\`
-   To generate a unique image: \`{ "command": "generate_image_element", "element_id": "team-member-1-image", "generation_prompt": "professional headshot of a female CEO, photorealistic", "alt_ro": "Portret CEO", "alt_en": "CEO portrait", "aspect_ratio": "1:1" }\`
-   To change a background image (e.g., in a hero slide): \`{ "command": "update_background_image", "section_id": "hero", "item_id": 1, "unsplash_query": "sunny beach" }\`
-   To update the contact map location: \`{ "command": "update_map_element", "element_id": "map-embed", "full_address": "Piata Universitatii, Bucharest, Romania" }\`
-   To change styles of a specific element: \`{ "command": "update_element_style", "element_id": "hero-title-1", "styles": { "color": "#FFFFFF", "fontSize": "48px" } }\`
-   To change the background/padding of a whole section: \`{ "command": "update_section_style", "section_id": "about", "styles": { "backgroundColor": "#F3F4F6", "padding": "60px 0" } }\`
-   To change a section's layout (template, itemCount, etc.): \`{ "command": "update_section_layout", "section_id": "services", "layout": { "template": "circular-icon", "itemCount": 4 } }\`
-   To duplicate an existing section (currently only 'About' is supported): \`{ "command": "duplicate_section", "section_id": "about" }\`
-   To create a new blog article: \`{ "command": "create_article", "title_ro": "Titlul Articolului", "title_en": "Article Title", "excerpt_ro": "Un scurt extras...", "excerpt_en": "A short excerpt...", "content_ro": "<h1>Titlu</h1><p>Conținut...</p>", "content_en": "<h1>Title</h1><p>Content...</p>", "image_query": "business meeting", "image_alt_ro": "Imagine articol", "image_alt_en": "Article image" }\`
-   To change the styling of cards within a section: \`{ "command": "update_card_style", "section_id": "services", "cardStyles": { "backgroundColor": "#FFFFFF", "boxShadow": "0 10px 15px -3px rgb(0 0 0 / 0.1)" } }\`
-   To show/hide a section: \`{ "command": "set_section_visibility", "section_id": "clients", "visible": false }\`
-   To change the order of sections: \`{ "command": "reorder_sections", "order": ["header", "hero", "services", "about", ...] }\`
-   To provide the final explanation (MUST BE THE LAST COMMAND): \`{ "command": "explanation", "text": "<h3>Modificări Raportate</h3><p>Am actualizat schema de culori și am adăugat o secțiune nouă de servicii.</p>" }\`

Now, analyze the user's prompt and the current JSON configuration, and generate the JSONL output of commands needed to achieve the user's request.`;

        try {
            // PHASE 1: Analyzing Request
            onProgress(5, 'analyzing');
            const fullPrompt = `${systemPrompt}\n\nCURRENT CONFIGURATION:\n${JSON.stringify(siteConfig, null, 2)}\n\nUSER PROMPT:\n${userPrompt}`;
            await new Promise(resolve => setTimeout(resolve, 200)); // Short delay for UI

            // PHASE 2: Generating Design Plan
            onProgress(10, 'generatingPlan');
            const responseText = await generateTextWithRetry(fullPrompt, 'text');

            // PHASE 3: Processing Commands
            onProgress(50, 'processingCommands');
            const commandLines = responseText.trim().split('\n');
            console.log("AI Response Lines:", commandLines.length);
            console.log("AI Response:", responseText.substring(0, 500) + "...");

            const allCommands: any[] = commandLines.map(line => {
                try {
                    const parsed = JSON.parse(line.trim());
                    console.log("Parsed command:", parsed.command);
                    return parsed;
                } catch (e) {
                    console.warn("Failed to parse line:", line);
                    return null;
                }
            }).filter(Boolean);

            console.log("Valid commands count:", allCommands.length);
            if (allCommands.length === 0) throw new Error("AI did not return any valid commands.");

            // Validate mandatory requirements
            const logoCommands = allCommands.filter(cmd => cmd.command === 'generate_image_element' && cmd.element_id === 'header-logo');
            const articleCommands = allCommands.filter(cmd => cmd.command === 'create_article');

            console.log("Logo commands:", logoCommands.length);
            console.log("Article commands:", articleCommands.length);

            if (logoCommands.length === 0) {
                console.warn("No logo generated, adding fallback logo command");
                allCommands.unshift({
                    command: 'generate_image_element',
                    element_id: 'header-logo',
                    generation_prompt: 'modern minimalist logo design for business website',
                    alt_ro: 'Logo site',
                    alt_en: 'Website logo',
                    aspect_ratio: '16:9'
                });
            }

            if (articleCommands.length < 3) {
                console.warn(`Only ${articleCommands.length} articles generated, adding more`);
                const additionalArticles = 3 - articleCommands.length;
                for (let i = 0; i < additionalArticles; i++) {
                    allCommands.push({
                        command: 'create_article',
                        title_ro: `Articol Important ${i + 1}`,
                        title_en: `Important Article ${i + 1}`,
                        excerpt_ro: `Un articol informativ despre serviciile noastre și beneficiile pentru clienți.`,
                        excerpt_en: `An informative article about our services and benefits for clients.`,
                        content_ro: `<h2>Articol ${i + 1}</h2><p>Acesta este un articol important care oferă informații valoroase pentru vizitatorii site-ului nostru.</p><p>Vă invităm să descoperiți mai multe despre serviciile noastre și cum vă putem ajuta.</p>`,
                        content_en: `<h2>Article ${i + 1}</h2><p>This is an important article that provides valuable information for our website visitors.</p><p>We invite you to discover more about our services and how we can help you.</p>`,
                        image_query: 'business professional office',
                        image_alt_ro: `Imagine articol ${i + 1}`,
                        image_alt_en: `Article image ${i + 1}`
                    });
                }
            }

            let explanation = '';
            const lastCommand = allCommands[allCommands.length - 1];
            if (lastCommand && lastCommand.command === 'explanation') {
                const rawText = allCommands.pop().text || '';
                explanation = rawText.trim().split(/\n\s*\n/).map((p: string) => `<p>${p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />')}</p>`).join('');
            }

            let newConfig = JSON.parse(JSON.stringify(siteConfig));

            const imageCommands = allCommands.filter(cmd => ['update_image_element', 'generate_image_element', 'update_background_image'].includes(cmd.command));
            const otherCommands = allCommands.filter(cmd => !imageCommands.includes(cmd));

            // PHASE 4: Fetching Creative Assets
            onProgress(60, `fetchingAssets 0/${imageCommands.length}`);
            const imagePromises: Promise<any>[] = [];
            let assetsFetched = 0;
            const assetProgressStart = 60;
            const assetProgressEnd = 85;

            imageCommands.forEach(cmd => {
                let promise: Promise<any>;
                if (cmd.command === 'update_image_element') {
                    promise = searchUnsplashPhotos(cmd.unsplash_query).then(photos => {
                        const { element } = findElement(newConfig, cmd.element_id);
                        if (element && photos.length > 0) {
                            (element as ImageElement).content = photos[0].urls.full;
                            (element as ImageElement).alt = { ro: cmd.alt_ro, en: cmd.alt_en };
                        }
                    }).catch(err => {
                        console.error(`Unsplash error for "${cmd.unsplash_query}":`, err);
                        const { element } = findElement(newConfig, cmd.element_id);
                        if (element) (element as ImageElement).content = `https://picsum.photos/seed/${cmd.unsplash_query.replace(/\s+/g, '-')}/800/600`;
                    });
                } else if (cmd.command === 'generate_image_element') {
                    promise = generateImage(cmd.generation_prompt).then(async base64Image => {
                        const { element } = findElement(newConfig, cmd.element_id);
                        if (element) {
                            const imageId = await storeImage(base64Image);
                            if (element.type === 'logo') {
                                element.logoType = 'image';
                                element.imageUrl = imageId;
                                element.alt = { ro: cmd.alt_ro, en: cmd.alt_en };
                            } else if (element.type === 'image') {
                                element.content = imageId;
                                element.alt = { ro: cmd.alt_ro, en: cmd.alt_en };
                            }
                        }
                    }).catch(err => {
                        console.error('❌ [useAI] Image generation error:');
                        console.error('❌ [useAI] Error:', err);
                        console.error('❌ [useAI] Generation prompt:', cmd.generation_prompt);
                    });
                } else { // update_background_image
                    promise = searchUnsplashPhotos(cmd.unsplash_query).then(photos => {
                        if (photos.length > 0) {
                            const newBg = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${photos[0].urls.full}')`;
                            const section = newConfig.sections[cmd.section_id];
                            if (section?.items && cmd.item_id != null) {
                                const item = section.items.find((i: any) => i.id === cmd.item_id);
                                if (item) item.styles = { ...item.styles, background: newBg, backgroundSize: 'cover', backgroundPosition: 'center' };
                            } else if (section) {
                                section.styles = { ...section.styles, background: newBg, backgroundSize: 'cover', backgroundPosition: 'center' };
                            }
                        }
                    }).catch(err => console.error(`Unsplash BG error for "${cmd.unsplash_query}":`, err));
                }

                imagePromises.push(promise.then(res => {
                    assetsFetched++;
                    const progress = assetProgressStart + (assetsFetched / imageCommands.length) * (assetProgressEnd - assetProgressStart);
                    onProgress(progress, `fetchingAssets ${assetsFetched}/${imageCommands.length}`);
                    return res;
                }));
            });

            if (imageCommands.length > 0) {
                console.log("Processing image commands...");
                try {
                    await Promise.all(imagePromises);
                    console.log("Image commands processed successfully");
                } catch (imageError) {
                    console.error("Error processing image commands:", imageError);
                    // Continue anyway, some images might have been processed
                }
            }

            // PHASE 5: Applying Final Changes
            onProgress(85, `applyingChanges 0/${otherCommands.length}`);
            let commandsApplied = 0;
            const finalProgressStart = 85;
            const finalProgressEnd = 100;

            console.log("Starting to apply other commands:", otherCommands.length);
            for (const cmd of otherCommands) {
                console.log(`Applying command: ${cmd.command}`);
                try {
                    switch (cmd.command) {
                        case 'update_element_content': {
                            const { element } = findElement(newConfig, cmd.element_id);
                            if (element && (element.type === 'rich-text' || element.type === 'logo')) {
                                if (cmd.lang === 'both') Object.assign(element.content, cmd.content);
                                else (element.content as any)[cmd.lang] = cmd.content;
                            }
                            break;
                        }
                        case 'update_map_element': {
                            const { element } = findElement(newConfig, cmd.element_id);
                            if (element && element.type === 'map') {
                                const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(cmd.full_address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                                element.content = `<iframe src="${embedUrl}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;
                            }
                            break;
                        }
                        case 'update_element_style': {
                            const { element } = findElement(newConfig, cmd.element_id);
                            if (element) element.styles = { ...element.styles, ...cmd.styles };
                            break;
                        }
                        case 'update_section_style':
                            if (newConfig.sections[cmd.section_id]) newConfig.sections[cmd.section_id].styles = { ...newConfig.sections[cmd.section_id].styles, ...cmd.styles };
                            break;
                        case 'update_section_layout':
                            if (newConfig.sections[cmd.section_id]) newConfig = modifyLayout(newConfig, cmd.section_id, cmd.layout);
                            break;
                        case 'update_card_style':
                            if (newConfig.sections[cmd.section_id]) newConfig = modifyLayout(newConfig, cmd.section_id, {}, cmd.cardStyles);
                            break;
                        case 'set_section_visibility':
                            if (newConfig.sections[cmd.section_id]) newConfig.sections[cmd.section_id].visible = cmd.visible;
                            break;
                        case 'reorder_sections':
                            newConfig.sectionOrder = cmd.order;
                            break;
                        case 'duplicate_section':
                            newConfig = duplicateSectionInConfig(newConfig, cmd.section_id);
                            break;
                        case 'create_article': {
                            // Create new article
                            if (!newConfig.articles) newConfig.articles = [];

                            const now = new Date().toISOString();
                            const slug = cmd.title_ro.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

                            // Get image from Unsplash
                            try {
                                const photos = await searchUnsplashPhotos(cmd.image_query);
                                const imageUrl = photos.length > 0 ? photos[0].urls.full : `https://picsum.photos/seed/${cmd.image_query.replace(/\s+/g, '-')}/800/450`;

                                const newArticle = {
                                    id: `article-${Date.now()}`,
                                    slug: slug,
                                    title: { ro: cmd.title_ro, en: cmd.title_en },
                                    excerpt: { ro: cmd.excerpt_ro, en: cmd.excerpt_en },
                                    content: { ro: cmd.content_ro, en: cmd.content_en },
                                    imageUrl: imageUrl,
                                    imageAlt: { ro: cmd.image_alt_ro, en: cmd.image_alt_en },
                                    metaTitle: { ro: cmd.title_ro, en: cmd.title_en },
                                    metaDescription: { ro: cmd.excerpt_ro, en: cmd.excerpt_en },
                                    createdAt: now,
                                    updatedAt: now,
                                };

                                newConfig.articles.push(newArticle);
                            } catch (err) {
                                console.error(`Unsplash error for article image "${cmd.image_query}":`, err);
                                // Fallback image
                                const newArticle = {
                                    id: `article-${Date.now()}`,
                                    slug: slug,
                                    title: { ro: cmd.title_ro, en: cmd.title_en },
                                    excerpt: { ro: cmd.excerpt_ro, en: cmd.excerpt_en },
                                    content: { ro: cmd.content_ro, en: cmd.content_en },
                                    imageUrl: `https://picsum.photos/seed/${cmd.image_query.replace(/\s+/g, '-')}/800/450`,
                                    imageAlt: { ro: cmd.image_alt_ro, en: cmd.image_alt_en },
                                    metaTitle: { ro: cmd.title_ro, en: cmd.title_en },
                                    metaDescription: { ro: cmd.excerpt_ro, en: cmd.excerpt_en },
                                    createdAt: now,
                                    updatedAt: now,
                                };

                                newConfig.articles.push(newArticle);
                            }
                            break;
                        }
                    }
                } catch (cmdError) {
                    console.error(`Error applying command ${cmd.command}:`, cmdError);
                    // Continue with next command instead of failing completely
                }
                commandsApplied++;
                const progress = finalProgressStart + (commandsApplied / otherCommands.length) * (finalProgressEnd - finalProgressStart);
                onProgress(progress, `applyingChanges ${commandsApplied}/${otherCommands.length}`);
            }

            console.log("All commands applied successfully");
            onProgress(100, 'finalizing');

            // Final sanitization pass
            console.log("Starting final sanitization");
            Object.values(newConfig.sections).forEach((s: any) => Object.values(s.elements).forEach((el: any) => {
                if (el.type === 'rich-text') { el.content.ro = sanitizeHTML(el.content.ro); el.content.en = sanitizeHTML(el.content.en); }
            }));

            console.log("Updating site config");
            setSiteConfig(newConfig);
            updateHistory(newConfig);
            console.log("AI rebuild completed successfully");

            // Ensure we have a valid explanation
            if (!explanation || explanation.trim() === '') {
                explanation = '<h3>Site Reconstruit cu Succes!</h3><p>Site-ul a fost reconstruit cu succes pe baza promptului tău. Toate modificările au fost aplicate și site-ul este gata pentru utilizare.</p>';
            }

            return explanation;

        } catch (error) {
            console.error("AI Rebuild Error:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            toast.error(t.aiRebuild.error, { description: errorMessage });
            throw error; // Throw error instead of returning undefined
        }
    }, [siteConfig, setSiteConfig, updateHistory, t, storeImage]);

    return { rebuildSiteWithAI };
};
