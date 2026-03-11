import { useState, useEffect } from 'react';
import { wpFetch } from '@/lib/wordpress';
import type { WPPost, Insight } from '@/types/wordpress';

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

function calcReadTime(contentHtml: string): string {
  const words = stripHtml(contentHtml).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

function normalizePost(post: WPPost): Insight {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  const terms = post._embedded?.['wp:term']?.[0];

  // Get subcategory name (skip "Publicações" parent, id 33)
  const category = terms?.find((t) => t.id !== 33)?.name ?? 'Artigo';

  const image =
    media?.media_details?.sizes?.large?.source_url ??
    media?.source_url ??
    '/insights_01.jpg';

  return {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title.rendered),
    category,
    readTime: calcReadTime(post.content.rendered),
    image,
    link: post.link,
  };
}

export function useInsights(count = 6) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    wpFetch<WPPost[]>(
      `/posts?categories=33&_embed&per_page=${count}&orderby=date&order=desc`,
      controller.signal
    )
      .then((posts) => {
        setInsights(posts.map(normalizePost));
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err);
        setLoading(false);
      });

    return () => controller.abort();
  }, [count]);

  return { insights, loading, error };
}
