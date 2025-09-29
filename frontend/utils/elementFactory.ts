
import type { SiteElement } from '../types';

// This factory creates a set of default elements for a new card item.
export const createDefaultCardElements = (sectionComponent: string, id: number): { [key: string]: SiteElement } => {
  switch (sectionComponent) {
    case 'Services':
      return {
        [`service-${id}-icon`]: { type: 'icon', iconName: 'BotMessageSquare', size: 40, color: '#c29a47' },
        [`service-${id}-title`]: { type: 'rich-text', content: { ro: 'Serviciu Nou', en: 'New Service' }, styles: { color: "#1F2937", fontSize: "20px", fontWeight: "600" }},
        [`service-${id}-text`]: { type: 'rich-text', content: { ro: 'Descrierea noului serviciu.', en: 'Description for the new service.' }, styles: { "color": "#6B7280" } },
        [`service-${id}-cta`]: { type: 'rich-text', content: { ro: 'Află Mai Mult', en: 'Learn More' } },
      };
    case 'Stats':
      return {
        [`stat-${id}-icon`]: { type: 'icon', iconName: 'Activity', size: 48, color: '#c29a47' },
        [`stat-${id}-number`]: { type: 'rich-text', content: { ro: '100+', en: '100+' }, styles: { color: "#0a284e", fontSize: "48px", fontWeight: "bold" } },
        [`stat-${id}-label`]: { type: 'rich-text', content: { ro: 'METRICĂ NOUĂ', en: 'NEW METRIC' }, styles: { color: "#4B5563", fontWeight: "600" } },
      };
    case 'Team':
        return {
            [`team-member-${id}-image`]: { type: 'image', content: `https://picsum.photos/seed/new-member-${id}/400/400`, alt: { ro: 'Membru nou', en: 'New Member' } },
            [`team-member-${id}-name`]: { type: 'rich-text', content: { ro: 'Nume Membru', en: 'Member Name' } },
            [`team-member-${id}-role`]: { type: 'rich-text', content: { ro: 'Rol', en: 'Role' } },
            [`team-member-${id}-bio`]: { type: 'rich-text', content: { ro: 'O scurtă biografie despre acest membru al echipei.', en: 'A short bio about this team member.' } },
            [`team-member-${id}-socials`]: { type: 'rich-text', content: { ro: '<a href="#">FB</a> <a href="#">LI</a>', en: '<a href="#">FB</a> <a href="#">LI</a>' } },
        };
    case 'Testimonials':
        return {
            [`testimonial-${id}-image`]: { type: 'image', content: `https://picsum.photos/seed/new-client-${id}/100/100`, alt: { ro: 'Client Nou', en: 'New Client' }},
            [`testimonial-${id}-text`]: { type: 'rich-text', content: { ro: '<p>“Un nou testimonial de la un client.”</p>', en: '<p>“A new testimonial from a client.”</p>' } },
            [`testimonial-${id}-author`]: { type: 'rich-text', content: { ro: 'Client Nou', en: 'New Client' }, styles: { color: "#FFFFFF", fontWeight: "600" } },
        };
    case 'Blog':
        return {
            [`post-${id}-image`]: { type: 'image', content: `https://picsum.photos/seed/new-post-${id}/500/300`, alt: { ro: 'Articol nou', en: 'New Post' } },
            [`post-${id}-category`]: { type: 'rich-text', content: { ro: 'CATEGORIE', en: 'CATEGORY' } },
            [`post-${id}-title`]: { type: 'rich-text', content: { ro: 'Titlul Noului Articol', en: 'New Post Title' } },
            [`post-${id}-excerpt`]: { type: 'rich-text', content: { ro: 'Un scurt rezumat al acestui articol de blog.', en: 'A short excerpt about this blog post.' } },
        };
    case 'HowItWorks':
        return {
            [`how-it-works-step-${id}-title`]: { type: 'rich-text', content: { ro: 'Pasul Nou', en: 'New Step' } },
            [`how-it-works-step-${id}-description`]: { type: 'rich-text', content: { ro: 'Descrierea pentru acest pas nou.', en: 'Description for this new step.' } },
            [`how-it-works-step-${id}-icon`]: { type: 'icon', iconName: 'Target', size: 64, color: '#c29a47' },
        };
    case 'Portfolio':
        return {
            [`portfolio-${id}-image`]: { type: 'image', content: `https://picsum.photos/seed/new-project-${id}/600/400`, alt: { ro: 'Proiect nou', en: 'New Project' } },
            [`portfolio-${id}-title`]: { type: 'rich-text', content: { ro: 'Proiect Nou', en: 'New Project' } },
            [`portfolio-${id}-category`]: { type: 'rich-text', content: { ro: 'Categorie', en: 'Category' } },
            [`portfolio-${id}-description`]: { type: 'rich-text', content: { ro: 'Descrierea noului proiect.', en: 'Description for the new project.' } },
            [`portfolio-${id}-cta`]: { type: 'rich-text', content: { ro: 'Vezi Detalii', en: 'View Details' } },
        };
    case 'Pricing':
        return {
            [`plan-${id}-title`]: { type: 'rich-text', content: { ro: 'Plan Nou', en: 'New Plan' } },
            [`plan-${id}-price`]: { type: 'rich-text', content: { ro: '€49', en: '$49' } },
            [`plan-${id}-period`]: { type: 'rich-text', content: { ro: '/ lună', en: '/ month' } },
            [`plan-${id}-features`]: { type: 'rich-text', content: { ro: '<ul><li>✓ Beneficiu Nou 1</li><li>✓ Beneficiu Nou 2</li></ul>', en: '<ul><li>✓ New Feature 1</li><li>✓ New Feature 2</li></ul>' } },
            [`plan-${id}-cta`]: { type: 'rich-text', content: { ro: 'Alege Planul', en: 'Choose Plan' } },
        };
    case 'FAQ':
      return {
        [`faq-${id}-question`]: { type: 'rich-text', content: { ro: 'Întrebare Nouă?', en: 'New Question?' } },
        [`faq-${id}-answer`]: { type: 'rich-text', content: { ro: '<p>Răspuns nou...</p>', en: '<p>New answer...</p>' } },
      };
    case 'Clients':
      return {
        [`client-${id}-logo`]: { type: 'image', content: `https://logo.clearbit.com/randomcompany${id}.com?size=100`, alt: { ro: 'Logo Client', en: 'Client Logo' } }
      };
    default:
      return {};
  }
};