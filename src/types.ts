export type CategoryId =
  | 'fashion-visuals'
  | 'fashion-ads'
  | 'jewellery-ads'
  | 'product-visuals'
  | 'product-ads'
  | 'ugc'
  | 'campaigns'
  | 'videos'
  | 'social'
  | 'fashion'
  | 'product';

export interface ProjectItem {
  id: string;
  title: string;
  category: CategoryId;
  categoryLabel: string;
  shortDescription: string;
  fullDescription: string;
  creativeDirection: string;
  imageUrl: string;
  videoUrl?: string;
  reelUrl?: string;
  thumbnailUrl?: string;
  externalUrl?: string;
  additionalImages?: string[];
  toolsUsed?: string[];
  clientOrBrand?: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  featured: boolean;
  visible: boolean;
  displayOrder: number;
  badgeLabel?: string;
}

export interface CategoryInfo {
  id: CategoryId;
  number: string;
  title: string;
  headline: string;
  description: string;
  accentName: string;
  primaryColor: string;
  secondaryColor: string;
  accentGradient: string;
  glowColor: string;
  buttonColor: string;
  buttonTextColor: string;
  buttonHoverBg: string;
  iconType: 'arrow-right' | 'arrow-up-right' | 'play' | 'sparkles';
  personality: {
    tag: string;
    animationStyle: string;
    keywords: string[];
  };
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  category: CategoryId;
  deliverables: string[];
}

export interface ProcessStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface SocialLink {
  platform: 'Instagram' | 'Facebook' | 'LinkedIn';
  handle: string;
  url: string;
  iconColor: string;
  bgBadgeColor: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  status: string;
}

export interface PortfolioConfig {
  profileImageUrl: string;
  name: string;
  heroIdentity: string;
  heroHeading: string;
  heroDescription: string;
  experienceSummary: string;
  education: string;
  introTitle: string;
  introSupporting: string;
  contactHeadline: string;
  categories: CategoryInfo[];
  projects: ProjectItem[];
  services: ServiceItem[];
  processSteps: ProcessStep[];
  socialLinks: SocialLink[];
  contact: ContactInfo;
}

export type ContactMethod = 'gmail' | 'whatsapp' | 'messages';
export type CollaborationStatus = 'pending' | 'accepted' | 'declined';

export interface CollaborationRecord {
  id: string; // Firestore document ID
  recordId: string; // e.g. REQ-2026-XXXX
  brandName: string; // Brand / Company name
  applicantName: string; // Contact person
  applicantEmail: string; // Official email
  applicantPhone?: string; // Phone number
  workType: string; // Specific type of work needed
  description: string; // Detailed description / brief
  preferredContactMethod: ContactMethod;
  budgetTimeline?: string;
  status: CollaborationStatus;
  userId?: string;
  createdAt?: any;
  updatedAt?: any;
  reviewedAt?: any;
  confirmedAt?: any;
  confirmationMessage?: string;
  adminReply?: string;
  replyTimestamp?: any;
  confirmationChannel?: ContactMethod;
  adminEmail?: string;
  adminNotes?: string;
}
