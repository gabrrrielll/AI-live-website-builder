
import * as ServiceCards from './services';
import * as StatCards from './stats';
import * as PortfolioCards from './portfolio';
import * as TeamCards from './team';
import * as PricingCards from './pricing';
import * as TestimonialCards from './testimonials';
import * as BlogCards from './blog';
import * as HowItWorksCards from './how-it-works';
import * as AboutLayouts from '../layouts/about';
import * as ClientCards from './clients';

export const aboutTemplateMap = {
    'image-left': AboutLayouts.AboutLayoutImageLeft,
    'image-right': AboutLayouts.AboutLayoutImageRight,
    'image-top': AboutLayouts.AboutLayoutImageTop,
    'overlay': AboutLayouts.AboutLayoutOverlay,
};

export const serviceTemplateMap = {
    'default': ServiceCards.ServiceCardDefault,
    'icon-left': ServiceCards.ServiceCardIconLeft,
    'top-border': ServiceCards.ServiceCardTopBorder,
    'circular-icon': ServiceCards.ServiceCardCircularIcon,
    'minimalist': ServiceCards.ServiceCardMinimalist,
    'detailed': ServiceCards.ServiceCardDetailed,
};

export const statsTemplateMap = {
    'default': StatCards.StatCardDefault,
    'contained': StatCards.StatCardContained,
    'left-aligned': StatCards.StatCardLeftAligned,
    'top-border': StatCards.StatCardTopBorder,
    'circular-icon': StatCards.StatCardCircularIcon,
    'minimalist-focus': StatCards.StatCardMinimalistFocus,
};

export const portfolioTemplateMap = {
    'default': PortfolioCards.PortfolioCardDefault,
    'hover': PortfolioCards.PortfolioCardHover,
    'text-below': PortfolioCards.PortfolioCardTextBelow,
    'overlay': PortfolioCards.PortfolioCardOverlay,
    'minimalist': PortfolioCards.PortfolioCardMinimalist,
    'detailed': PortfolioCards.PortfolioCardDetailed,
};

export const teamTemplateMap = {
    'default': TeamCards.TeamCardDefault,
    'image-left': TeamCards.TeamCardImageLeft,
    'overlay': TeamCards.TeamCardOverlay,
    'social': TeamCards.TeamCardSocial,
    'bio': TeamCards.TeamCardBio,
    'minimal': TeamCards.TeamCardMinimal,
};

export const pricingTemplateMap = {
    'default': PricingCards.PricingCardDefault,
    'detailed': PricingCards.PricingCardDetailed,
    'top-highlight': PricingCards.PricingCardTopHighlight,
    'simple': PricingCards.PricingCardSimple,
    'clean': PricingCards.PricingCardClean,
    'split': PricingCards.PricingCardSplit,
};

export const testimonialTemplateMap = {
    'default': TestimonialCards.TestimonialCardDefault,
    'image-left': TestimonialCards.TestimonialCardImageLeft,
    'centered-image': TestimonialCards.TestimonialCardCenteredImage,
    'simple-quote': TestimonialCards.TestimonialCardSimpleQuote,
    'boxed': TestimonialCards.TestimonialCardBoxed,
    'modern': TestimonialCards.TestimonialCardModern,
};

export const blogTemplateMap = {
    'default': BlogCards.BlogCardDefault,
    'image-left': BlogCards.BlogCardImageLeft,
    'overlay': BlogCards.BlogCardOverlay,
    'minimalist': BlogCards.BlogCardMinimalist,
    'centered': BlogCards.BlogCardCentered,
};

export const howItWorksTemplateMap = {
    'default': HowItWorksCards.HowItWorksCardDefault,
    'left': HowItWorksCards.HowItWorksCardLeft,
    'minimalist': HowItWorksCards.HowItWorksCardMinimalist,
    'connected': HowItWorksCards.HowItWorksCardConnected,
    'tilted': HowItWorksCards.HowItWorksCardTilted,
    'icon-focus': HowItWorksCards.HowItWorksCardIconFocus,
};

export const clientTemplateMap = {
    'default': ClientCards.ClientCardDefault,
    'boxed': ClientCards.ClientCardBoxed,
    'minimalist': ClientCards.ClientCardMinimalist,
};