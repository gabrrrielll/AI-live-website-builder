export type Language = 'ro' | 'en';

export type LocalizedString = {
  [key in Language]: string;
};

export type ElementType = 'rich-text' | 'image' | 'map' | 'logo' | 'form-config' | 'icon';

export interface BaseElement {
  type: ElementType;
  styles?: React.CSSProperties;
}

export interface RichTextElement extends BaseElement {
  type: 'rich-text';
  content: LocalizedString; // HTML content for both languages
}

export interface ImageElement extends BaseElement {
  type: 'image';
  content: string; // image URL is not localized
  alt: LocalizedString;
}

export interface MapElement extends BaseElement {
  type: 'map';
  content: string; // Full iframe embed code from Google Maps
}

export interface LogoElement extends BaseElement {
  type: 'logo';
  logoType: 'text' | 'image';
  content: LocalizedString; // for text logo
  imageUrl: string; // for image logo
  alt: LocalizedString; // for image logo
}

export interface FormConfigElement extends BaseElement {
  type: 'form-config';
  recipientEmail: string;
}

export interface IconElement extends BaseElement {
  type: 'icon';
  iconName: string; // From lucide-react
  size: number;
  color: string;
}

export type SiteElement = RichTextElement | ImageElement | MapElement | LogoElement | FormConfigElement | IconElement;

export interface Section {
  id: string;
  component: string; // e.g., 'Header', 'Hero'
  visible: boolean;
  navTitle?: LocalizedString;
  navLinkVisible?: boolean;
  elements: {
    [id: string]: SiteElement;
  };
  styles?: React.CSSProperties;
  items?: any[]; // For dynamic lists of items like FAQs, Services, Team members
  layout?: {
    template?: string; // e.g., 'default', 'alternative'
    variant?: string; // e.g., 'slider', 'gradient-waves'
    itemCount?: number;
    imageWidth?: number;
    duration?: number; // in seconds, for carousels
    carousel?: boolean;
    // Gradient waves specific settings
    gradientColors?: {
      color1: string;
      color2: string;
      color3: string;
      color4: string;
    };
    waveAnimation?: {
      speed: number; // animation speed multiplier
      intensity: number; // wave intensity
      spacing: number; // distance between waves (1-10)
    };
  };
  cardStyles?: React.CSSProperties;
}

export interface Page {
  id: string;
  elements: {
    [id: string]: SiteElement;
  };
}

export interface Article {
  id: string;
  slug: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  content: LocalizedString;
  imageUrl: string;
  imageAlt: LocalizedString;
  metaTitle: LocalizedString;
  metaDescription: LocalizedString;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

export interface SiteConfig {
  metadata: {
    version: string;
    lastModified: string;
    userType: 'free' | 'premium';
  };
  sections: {
    [id: string]: Section;
  };
  sectionOrder: string[];
  pages?: {
    [id: string]: Page;
  };
  articles?: Article[];
}

// Literal types for template names for AI prompt generation
export type AboutTemplate = 'image-left' | 'image-right' | 'image-top' | 'overlay';
export type ServiceTemplate = 'default' | 'icon-left' | 'top-border' | 'circular-icon' | 'minimalist' | 'detailed';
export type TeamTemplate = 'default' | 'image-left' | 'overlay' | 'social' | 'bio' | 'minimal';
export type HowItWorksTemplate = 'default' | 'left' | 'minimalist' | 'connected' | 'tilted' | 'icon-focus';
export type StatsTemplate = 'default' | 'contained' | 'left-aligned' | 'top-border' | 'circular-icon' | 'minimalist-focus';
export type PricingTemplate = 'default' | 'detailed' | 'top-highlight' | 'simple' | 'clean' | 'split';
export type TestimonialTemplate = 'default' | 'image-left' | 'centered-image' | 'simple-quote' | 'boxed' | 'modern';
export type BlogTemplate = 'default' | 'image-left' | 'overlay' | 'minimalist' | 'centered';
export type PortfolioTemplate = 'default' | 'hover' | 'text-below' | 'overlay' | 'minimalist' | 'detailed';