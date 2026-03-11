import { useState, useEffect } from 'react';
import { wpFetch } from '@/lib/wordpress';
import type { WPPost, Partner } from '@/types/wordpress';

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

// Tags mapped statically per partner (WP posts don't have structured tags for these)
const PARTNER_TAGS: Record<string, string[]> = {
  'softexpert-2': ['GESTÃO', 'CONFORMIDADE', 'EXCELÊNCIA'],
  'biti9-rpa': ['RPA', 'AUTOMAÇÃO', 'IA'],
};

function normalizePartner(post: WPPost): Partner {
  return {
    id: post.id,
    slug: post.slug,
    name: stripHtml(post.title.rendered),
    description: stripHtml(post.excerpt.rendered),
    tags: PARTNER_TAGS[post.slug] ?? [],
  };
}

export function usePartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    wpFetch<WPPost[]>(
      '/posts?categories=39&_embed&per_page=10',
      controller.signal
    )
      .then((posts) => {
        setPartners(posts.map(normalizePartner));
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { partners, loading, error };
}
