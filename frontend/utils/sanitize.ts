import DOMPurify from 'dompurify';

export const sanitizeHTML = (dirtyHTML: string): string => {
  return DOMPurify.sanitize(dirtyHTML, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['style', 'script'],
    FORBID_ATTR: [
      'onerror',
      'onload',
      'onclick',
      'onmouseover',
      'onfocus',
      'onblur',
      'onsubmit',
      'onmouseenter',
      'onmouseleave',
      'onanimationstart',
      'onanimationend',
      'formaction',
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|\/|#|\.{1,2}\/)/i,
  });
};
