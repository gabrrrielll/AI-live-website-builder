import DOMPurify from 'dompurify';

export const sanitizeHTML = (dirtyHTML: string): string => {
  // We allow the 'style' attribute for rich text formatting but forbid dangerous event handlers.
  return DOMPurify.sanitize(dirtyHTML, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['style', 'script'], // Forbid <style> and <script> tags
    FORBID_ATTR: ['onerror', 'onload'], // Allow 'style' attribute but forbid dangerous ones
  });
};
