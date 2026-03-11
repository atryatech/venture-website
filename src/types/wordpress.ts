// WordPress REST API response types

export interface WPRendered {
  rendered: string;
}

export interface WPMediaSize {
  source_url: string;
  width: number;
  height: number;
}

export interface WPMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_details: {
    sizes: {
      thumbnail?: WPMediaSize;
      medium?: WPMediaSize;
      medium_large?: WPMediaSize;
      large?: WPMediaSize;
      full?: WPMediaSize;
    };
  };
}

export interface WPTerm {
  id: number;
  name: string;
  slug: string;
}

export interface WPPost {
  id: number;
  slug: string;
  link: string;
  title: WPRendered;
  excerpt: WPRendered;
  content: WPRendered;
  featured_media: number;
  categories: number[];
  _embedded?: {
    'wp:featuredmedia'?: WPMedia[];
    'wp:term'?: WPTerm[][];
  };
}

// Normalized types consumed by components

export interface Insight {
  id: number;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  image: string;
  link: string;
}

export interface CaseStudy {
  id: number;
  slug: string;
  client: string;
  headline: string;
  body: string;
  image: string;
  link: string;
}

export interface Partner {
  id: number;
  slug: string;
  name: string;
  description: string;
  tags: string[];
  image?: string;
}

export interface CF7Response {
  status: 'mail_sent' | 'mail_failed' | 'validation_failed' | 'spam';
  message: string;
  invalid_fields?: Array<{ field: string; message: string }>;
}
