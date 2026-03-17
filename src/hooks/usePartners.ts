import { useState, useEffect } from 'react';
import { wpFetch } from '@/lib/wordpress';
import { normalizePartner } from '@/lib/wordpress-content';
import type { WPPost, Partner } from '@/types/wordpress';

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
