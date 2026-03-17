import { useState, useEffect } from 'react';
import { wpFetch } from '@/lib/wordpress';
import { normalizeInsight } from '@/lib/wordpress-content';
import type { WPPost, Insight } from '@/types/wordpress';

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
        setInsights(posts.map(normalizeInsight));
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
