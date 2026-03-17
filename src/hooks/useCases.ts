import { useState, useEffect } from 'react';
import { wpFetch } from '@/lib/wordpress';
import { normalizeCase } from '@/lib/wordpress-content';
import type { WPPost, CaseStudy } from '@/types/wordpress';

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
