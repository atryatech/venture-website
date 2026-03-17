// WordPress REST API response types

export interface WPRendered {
  rendered: string;
}

export interface WPMediaSize {
  source_url: string;
  width: number | string;
  height: number | string;
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

export interface WPSEOImage {
  url: string;
  width?: number | string;
  height?: number | string;
  type?: string;
}

export interface WPSEOData {
  title?: string;
  description?: string;
  canonical?: string;
  og_title?: string;
  og_description?: string;
  og_url?: string;
  og_site_name?: string;
  article_modified_time?: string;
  og_image?: WPSEOImage[];
}

export interface WPTerm {
  id: number;
  name: string;
  slug: string;
}

export interface WPContentBase {
  id: number;
  slug: string;
  link: string;
  date: string;
  modified: string;
  title: WPRendered;
  excerpt: WPRendered;
  content: WPRendered;
  featured_media: number;
  yoast_head_json?: WPSEOData;
  categories: number[];
  _embedded?: {
    'wp:featuredmedia'?: WPMedia[];
    'wp:term'?: WPTerm[][];
  };
}

export interface WPPost extends WPContentBase {
  type?: 'post';
}

export interface WPPage {
  id: number;
  slug: string;
  link: string;
  date: string;
  modified: string;
  title: WPRendered;
  excerpt: WPRendered;
  content: WPRendered;
  featured_media: number;
  parent: number;
  yoast_head_json?: WPSEOData;
  _embedded?: {
    'wp:featuredmedia'?: WPMedia[];
    'wp:term'?: WPTerm[][];
  };
  type?: 'page';
}

// Normalized types consumed by components

export type ContentFamily = 'insight' | 'case' | 'service' | 'partner';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export type ContentBlock =
  | {
      type: 'heading' | 'paragraph' | 'quote';
      content: string;
    }
  | {
      type: 'list';
      items: string[];
    }
  | {
      type: 'image';
      src: string;
      alt: string;
    };

export interface ContentSummary {
  id: number;
  slug: string;
  family: ContentFamily;
  title: string;
  description: string;
  image: string;
  href: string;
  eyebrow: string;
  meta?: string;
  tags?: string[];
}

export interface ContentDetail extends ContentSummary {
  excerpt: string;
  blocks: ContentBlock[];
  breadcrumbs: BreadcrumbItem[];
  publishedAt?: string;
  updatedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonical?: string;
  ogImage?: string;
}

export interface Insight {
  id: number;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  image: string;
  link: string;
  summary: string;
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
  link: string;
}

export interface CF7Response {
  status: 'mail_sent' | 'mail_failed' | 'validation_failed' | 'spam';
  message: string;
  invalid_fields?: Array<{ field: string; message: string }>;
}
