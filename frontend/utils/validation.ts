import { z } from 'zod';

// Schema for localized strings
const localizedStringSchema = z.object({
  ro: z.string(),
  en: z.string(),
});

// Base schema for CSS properties - not exhaustive but covers common cases
const cssPropertiesSchema = z.record(z.string(), z.any()).optional();

const baseElementSchema = z.object({
  styles: cssPropertiesSchema,
});

const richTextElementSchema = baseElementSchema.extend({
  type: z.literal('rich-text'),
  content: localizedStringSchema,
});

const imageElementSchema = baseElementSchema.extend({
  type: z.literal('image'),
  content: z.string().url({ message: "Invalid image URL" }),
  alt: localizedStringSchema,
});

const mapElementSchema = baseElementSchema.extend({
    type: z.literal('map'),
    content: z.string().refine(val => val.includes('<iframe') && val.includes('src='), { message: "Content must be a valid iframe embed code" }),
});

const logoElementSchema = baseElementSchema.extend({
    type: z.literal('logo'),
    logoType: z.enum(['text', 'image']),
    content: localizedStringSchema,
    imageUrl: z.string().optional(),
    alt: localizedStringSchema,
});

const formConfigElementSchema = baseElementSchema.extend({
    type: z.literal('form-config'),
    recipientEmail: z.string().email(),
});

const iconElementSchema = baseElementSchema.extend({
    type: z.literal('icon'),
    iconName: z.string(),
    size: z.number(),
    color: z.string(),
});

const siteElementSchema = z.discriminatedUnion('type', [
  richTextElementSchema,
  imageElementSchema,
  mapElementSchema,
  logoElementSchema,
  formConfigElementSchema,
  iconElementSchema,
]);

const sectionSchema = z.object({
  id: z.string(),
  component: z.string(),
  visible: z.boolean(),
  navTitle: localizedStringSchema.optional(),
  elements: z.record(z.string(), siteElementSchema),
  styles: cssPropertiesSchema,
  items: z.array(z.any()).optional(), // For dynamic items like FAQs
});

const pageSchema = z.object({
  id: z.string(),
  elements: z.record(z.string(), siteElementSchema),
});

export const siteConfigSchema = z.object({
  metadata: z.object({
    version: z.string(),
    lastModified: z.string().datetime({ message: "Invalid date format" }),
    userType: z.enum(['free', 'premium']),
  }),
  sections: z.record(z.string(), sectionSchema),
  sectionOrder: z.array(z.string()),
  pages: z.record(z.string(), pageSchema).optional(),
}).refine(data => {
    const sectionKeys = Object.keys(data.sections);
    return data.sectionOrder.every(id => sectionKeys.includes(id));
}, {
    message: "sectionOrder contains IDs that do not exist in sections",
    path: ['sectionOrder'],
});
