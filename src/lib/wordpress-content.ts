import type {
  BreadcrumbItem,
  CaseStudy,
  ContentBlock,
  ContentDetail,
  ContentFamily,
  ContentSummary,
  Insight,
  Partner,
  WPContentBase,
  WPPage,
  WPPost,
  WPTerm,
} from '@/types/wordpress';

const formatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

export const WORDPRESS_CATEGORY_IDS = {
  insights: 33,
  cases: 34,
  partners: 39,
  services: 36,
} as const;

export const WORDPRESS_SERVICE_PARENT_ID = 1717;

export const serviceHighlights = [
  {
    id: 'estrategia',
    slug: 'estrategia-sustentabilidade-riscos',
    label: 'ESTRATÉGIA',
    title: 'Estratégia e Sustentabilidade, com visão de longo prazo.',
  },
  {
    id: 'digital',
    slug: 'transformacao-digital-processos',
    label: 'TRANSFORMAÇÃO',
    title: 'Transformação Digital com uso de tecnologias inovadoras.',
  },
  {
    id: 'perf',
    slug: 'performance-tecnologia-rpa',
    label: 'PERFORMANCE',
    title: 'Performance e Tecnologia em automação e TI.',
  },
  {
    id: 'projetos',
    slug: 'gestao-de-processos-em-projetos',
    label: 'PROJETOS',
    title: 'Gestão em Projetos de Capital, controlando riscos e prazos.',
  },
] as const;

const serviceHighlightMap = Object.fromEntries(
  serviceHighlights.map((item, index) => [item.slug, { ...item, order: index }])
);

const caseClientMap: Record<string, string> = {
  'como-fazer-mais-com-menos': 'Vale',
  'como-integrar-os-processos-do-projeto': 'Anglo American',
  'estrategia-corporativa': 'SWM',
};

const partnerTagsMap: Record<string, string[]> = {
  'softexpert-2': ['GESTÃO', 'CONFORMIDADE', 'EXCELÊNCIA'],
  'biti9-rpa': ['RPA', 'AUTOMAÇÃO', 'IA'],
};

export const familyMeta: Record<
  ContentFamily,
  {
    singular: string;
    plural: string;
    routeBase: string;
    listingTitle: string;
    listingDescription: string;
    emptyMessage: string;
  }
> = {
  insight: {
    singular: 'Insight',
    plural: 'Insights',
    routeBase: '/insights',
    listingTitle: 'Insights e publicações',
    listingDescription: 'Análises, relatórios e tendências publicadas pela Venture.',
    emptyMessage: 'Nenhum insight encontrado no momento.',
  },
  case: {
    singular: 'Case',
    plural: 'Cases',
    routeBase: '/cases',
    listingTitle: 'Cases de transformação operacional',
    listingDescription: 'Projetos e resultados entregues com foco em eficiência, governança e escala.',
    emptyMessage: 'Nenhum case encontrado no momento.',
  },
  service: {
    singular: 'Serviço',
    plural: 'Serviços',
    routeBase: '/servicos',
    listingTitle: 'Serviços Venture',
    listingDescription: 'Frentes de atuação que conectam estratégia, processos, risco e tecnologia.',
    emptyMessage: 'Nenhum serviço encontrado no momento.',
  },
  partner: {
    singular: 'Parceiro',
    plural: 'Parcerias',
    routeBase: '/parceiros',
    listingTitle: 'Parcerias estratégicas',
    listingDescription: 'Ecossistema de parceiros que amplia a capacidade de execução da Venture.',
    emptyMessage: 'Nenhum parceiro encontrado no momento.',
  },
};

export function getContentPath(family: ContentFamily, slug?: string): string {
  const base = familyMeta[family].routeBase;
  return slug ? `${base}/${slug}` : base;
}

export function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return normalizeWhitespace(doc.body.textContent || '');
}

export function calcReadTime(contentHtml: string): string {
  const words = stripHtml(contentHtml).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

export function isSupportedPostFamily(post: WPPost, family: Exclude<ContentFamily, 'service'>): boolean {
  const categoryId =
    family === 'insight'
      ? WORDPRESS_CATEGORY_IDS.insights
      : family === 'case'
        ? WORDPRESS_CATEGORY_IDS.cases
        : WORDPRESS_CATEGORY_IDS.partners;

  return post.categories.includes(categoryId);
}

export function sortServicePages(pages: WPPage[]): WPPage[] {
  return pages
    .filter((page) => page.parent === WORDPRESS_SERVICE_PARENT_ID)
    .filter((page) => page.slug in serviceHighlightMap)
    .sort((left, right) => serviceHighlightMap[left.slug].order - serviceHighlightMap[right.slug].order);
}

export function normalizeInsight(post: WPPost): Insight {
  const terms = getEmbeddedTerms(post);
  const category = terms.find((term) => term.id !== WORDPRESS_CATEGORY_IDS.insights)?.name ?? 'Artigo';

  return {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title.rendered),
    category,
    readTime: calcReadTime(post.content.rendered),
    image: resolvePrimaryImage(post, '/insights_01.jpg'),
    link: getContentPath('insight', post.slug),
    summary: resolveDescription(post),
  };
}

export function normalizeCase(post: WPPost): CaseStudy {
  return {
    id: post.id,
    slug: post.slug,
    client: caseClientMap[post.slug] ?? stripHtml(post.title.rendered),
    headline: stripHtml(post.title.rendered),
    body: resolveDescription(post),
    image: resolvePrimaryImage(post, '/case_vale.jpg'),
    link: getContentPath('case', post.slug),
  };
}

export function normalizePartner(post: WPPost): Partner {
  return {
    id: post.id,
    slug: post.slug,
    name: stripHtml(post.title.rendered),
    description: resolveDescription(post),
    tags: partnerTagsMap[post.slug] ?? [],
    image: resolvePrimaryImage(post, '/logo-250x60.png'),
    link: getContentPath('partner', post.slug),
  };
}

export function normalizeSummary(
  family: ContentFamily,
  item: WPPost | WPPage
): ContentSummary {
  if (family === 'insight') {
    const insight = normalizeInsight(item as WPPost);
    return {
      id: insight.id,
      slug: insight.slug,
      family,
      title: insight.title,
      description: insight.summary,
      image: insight.image,
      href: insight.link,
      eyebrow: insight.category,
      meta: insight.readTime,
    };
  }

  if (family === 'case') {
    const caseStudy = normalizeCase(item as WPPost);
    return {
      id: caseStudy.id,
      slug: caseStudy.slug,
      family,
      title: caseStudy.client,
      description: caseStudy.body,
      image: caseStudy.image,
      href: caseStudy.link,
      eyebrow: 'Case',
      meta: formatDate((item as WPPost).modified),
    };
  }

  if (family === 'partner') {
    const partner = normalizePartner(item as WPPost);
    return {
      id: partner.id,
      slug: partner.slug,
      family,
      title: partner.name,
      description: partner.description,
      image: partner.image ?? '/logo-250x60.png',
      href: partner.link,
      eyebrow: 'Parceiro',
      meta: partner.tags.slice(0, 2).join(' • '),
      tags: partner.tags,
    };
  }

  const service = item as WPPage;
  const highlight = serviceHighlightMap[service.slug];

  return {
    id: service.id,
    slug: service.slug,
    family,
    title: stripHtml(service.title.rendered),
    description: highlight?.title ?? resolveDescription(service),
    image: resolvePrimaryImage(service, '/hero_portrait.jpg'),
    href: getContentPath('service', service.slug),
    eyebrow: highlight?.label ?? 'Serviço',
    meta: formatDate(service.modified),
  };
}

export function normalizeDetail(
  family: ContentFamily,
  item: WPPost | WPPage
): ContentDetail {
  const summary = normalizeSummary(family, item);
  const title = stripHtml(item.title.rendered);
  const description = item.yoast_head_json?.description ?? summary.description;
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Início', href: '/' },
    { label: familyMeta[family].plural, href: getContentPath(family) },
    { label: title, href: getContentPath(family, item.slug) },
  ];

  return {
    ...summary,
    excerpt: resolveDescription(item),
    blocks: extractContentBlocks(item.content.rendered, title),
    breadcrumbs,
    publishedAt: formatDate(item.date),
    updatedAt: formatDate(item.modified),
    seoTitle: item.yoast_head_json?.title ?? title,
    seoDescription: description,
    canonical: getContentPath(family, item.slug),
    ogImage: resolvePrimaryImage(item, summary.image),
  };
}

function resolveDescription(item: WPPost | WPPage): string {
  const seoDescription = item.yoast_head_json?.description;
  if (seoDescription && !looksLikeChrome(seoDescription)) {
    return seoDescription;
  }

  const excerpt = stripHtml(item.excerpt.rendered);
  const firstParagraph = extractFirstParagraph(item.content.rendered);

  if (excerpt && !looksLikeChrome(excerpt)) {
    return excerpt;
  }

  return firstParagraph || excerpt || '';
}

function formatDate(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return formatter.format(date);
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function getEmbeddedTerms(item: WPContentBase): WPTerm[] {
  return item._embedded?.['wp:term']?.flat().filter(Boolean) ?? [];
}

function resolvePrimaryImage(item: WPPost | WPPage, fallback: string): string {
  const media = item._embedded?.['wp:featuredmedia']?.[0];
  const mediaImage =
    media?.media_details?.sizes?.large?.source_url ??
    media?.media_details?.sizes?.full?.source_url ??
    media?.source_url;

  if (mediaImage) {
    return mediaImage;
  }

  const seoImage = item.yoast_head_json?.og_image?.[0]?.url;
  if (seoImage) {
    return seoImage;
  }

  const doc = new DOMParser().parseFromString(item.content.rendered, 'text/html');
  const contentImage = doc.querySelector('img[src]')?.getAttribute('src');

  return contentImage || fallback;
}

function extractFirstParagraph(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const paragraph = Array.from(doc.querySelectorAll('p'))
    .map((element) => normalizeWhitespace(element.textContent || ''))
    .find(Boolean);

  return paragraph ?? '';
}

function extractContentBlocks(html: string, currentTitle: string): ContentBlock[] {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const roots = resolveContentRoots(doc);
  const blocks: ContentBlock[] = [];
  const seen = new Set<string>();

  for (const root of roots) {
    const elements = Array.from(root.querySelectorAll('h1, h2, h3, h4, p, ul, ol, blockquote, img'));

    for (const element of elements) {
      if (shouldIgnoreElement(element)) {
        continue;
      }

      if (element.tagName === 'IMG') {
        const src = element.getAttribute('src');
        if (!src) {
          continue;
        }

        const key = `image:${src}`;
        if (seen.has(key)) {
          continue;
        }

        blocks.push({
          type: 'image',
          src,
          alt: normalizeWhitespace(element.getAttribute('alt') || currentTitle),
        });
        seen.add(key);
        continue;
      }

      if (element.tagName === 'UL' || element.tagName === 'OL') {
        const items = Array.from(element.querySelectorAll(':scope > li'))
          .map((item) => normalizeWhitespace(item.textContent || ''))
          .filter(Boolean);

        if (items.length === 0) {
          continue;
        }

        const key = `list:${items.join('|')}`;
        if (seen.has(key)) {
          continue;
        }

        blocks.push({ type: 'list', items });
        seen.add(key);
        continue;
      }

      const content = normalizeWhitespace(element.textContent || '');
      if (!content || content === currentTitle || seen.has(content) || looksLikeChrome(content)) {
        continue;
      }

      if (/^h[1-4]$/i.test(element.tagName)) {
        blocks.push({ type: 'heading', content });
      } else if (element.tagName === 'BLOCKQUOTE') {
        blocks.push({ type: 'quote', content });
      } else {
        blocks.push({ type: 'paragraph', content });
      }

      seen.add(content);
    }
  }

  if (blocks.length > 0) {
    return blocks;
  }

  const fallback = stripHtml(html)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .slice(0, 8)
    .map((content) => ({ type: 'paragraph', content }) as ContentBlock);

  return fallback;
}

function resolveContentRoots(doc: Document): HTMLElement[] {
  const richRoots = Array.from(
    doc.querySelectorAll<HTMLElement>('.dslc-tp-content #dslc-theme-content-inner')
  );

  if (richRoots.length > 0) {
    return richRoots;
  }

  const simpleRoots = Array.from(doc.querySelectorAll<HTMLElement>('.dslc-text-module-content'));
  if (simpleRoots.length > 0) {
    return simpleRoots;
  }

  const semanticRoots = Array.from(doc.querySelectorAll<HTMLElement>('article, main, .entry-content'));
  if (semanticRoots.length > 0) {
    return semanticRoots;
  }

  return [doc.body];
}

function shouldIgnoreElement(element: Element): boolean {
  return Boolean(
    element.closest(
      [
        '#dslc-header',
        '.dslc-navigation',
        '.dslc-mobile-navigation',
        '.menu',
        '.sub-menu',
        '.essgrid',
        '.esg-grid',
        'nav',
        'header',
        'footer',
        'script',
        'style',
        'form',
        'select',
      ].join(', ')
    )
  );
}

function looksLikeChrome(content: string): boolean {
  const lowered = content.toLowerCase();

  return (
    lowered.includes('home empresa serviços') ||
    lowered.includes('cases publicações parcerias contato') ||
    lowered.includes('clique aqui e conheça mais') ||
    lowered.startsWith('[ess_grid')
  );
}