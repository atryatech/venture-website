import { useState, useEffect } from 'react';
import { wpFetch } from '@/lib/wordpress';
import type { WPPost, CaseStudy } from '@/types/wordpress';

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

// Slug-to-client mapping (verified from WP API)
const SLUG_CLIENT_MAP: Record<string, string> = {
  'como-fazer-mais-com-menos': 'Vale',
  'como-integrar-os-processos-do-projeto': 'Anglo American',
  'estrategia-corporativa': 'SWM',
};

function normalizeCase(post: WPPost): CaseStudy {
  const media = post._embedded?.['wp:featuredmedia']?.[0];

  const image =
    media?.media_details?.sizes?.large?.source_url ??
    media?.source_url ??
    '';

  return {
    id: post.id,
    slug: post.slug,
    client: SLUG_CLIENT_MAP[post.slug] ?? stripHtml(post.title.rendered),
    headline: stripHtml(post.title.rendered),
    body: stripHtml(post.excerpt.rendered),
    image,
    link: post.link,
  };
}

export function useCases() {
  const [vale, setVale] = useState<CaseStudy | null>(null);
  const [anglo, setAnglo] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    wpFetch<WPPost[]>(
      '/posts?categories=34&_embed&per_page=10',
      controller.signal
    )
      .then((posts) => {
        const valePost = posts.find((p) => p.slug === 'como-fazer-mais-com-menos');
        const angloPost = posts.find((p) => p.slug === 'como-integrar-os-processos-do-projeto');

        if (valePost) setVale(normalizeCase(valePost));
        if (angloPost) setAnglo(normalizeCase(angloPost));
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { vale, anglo, loading, error };
}
