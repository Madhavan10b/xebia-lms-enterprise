export interface Category {
  id: number;
  name: string;
  icon?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Content {
  id: number;
  type: 'text' | 'code' | 'video' | 'image' | 'heading' | 'callout' | 'table';
  text?: string;
  code?: string;
  language?: string;
  videoUrl?: string;
  imageUrl?: string;
  alt?: string;
  caption?: string;
  title?: string;
  headingLevel?: number;
  contentOrder?: number;
  isActive?: boolean;
}

export interface Submodule {
  id: number;
  title: string;
  description?: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  submoduleOrder?: number;
  isActive?: boolean;
  contents?: Content[];
}

export interface Module {
  id: number;
  title: string;
  description?: string;
  moduleOrder?: number;
  isActive?: boolean;
  submodules?: Submodule[];
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  language?: string;
  duration?: string;
  icon?: string;
  thumbnail?: string;
  bannerImage?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string;
  focusKeywords?: string;
  robots?: string;
  author?: string;
  seoCategory?: string;
  seoTags?: string;
  
  // Open Graph
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  
  // Twitter
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: string;
  
  // Schema Markup
  schemaMarkup?: string;
  faqSchema?: string;
  breadcrumbSchema?: string;
  
  // Media / outcomes
  youtubeVideoUrl?: string;
  previewVideoUrl?: string;
  learningOutcomes?: string;
  prerequisites?: string;
  targetAudience?: string;
  courseHighlights?: string;
  careerOpportunities?: string;
  
  // Programmatic SEO
  searchIntent?: string;
  semanticKeywords?: string;
  relatedTopics?: string;
  searchSynonyms?: string;
  
  // FAQ
  faqContent?: string;
  customHeadScript?: string;
  customBodyScript?: string;
  
  // Analytics
  totalViews?: number;
  totalClicks?: number;
  ctr?: number;
  seoScore?: number;
  
  // Flags
  isPublished?: boolean;
  allowIndexing?: boolean;
  showInSearch?: boolean;
  
  // Relationships
  category: Category;
  modules?: Module[];
  createdAt?: string;
  updatedAt?: string;
}
