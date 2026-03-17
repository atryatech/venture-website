import { useEffect, useReducer } from 'react';

import { wpFetch } from '@/lib/wordpress';
import {
  WORDPRESS_CATEGORY_IDS,
  isSupportedPostFamily,
  normalizeDetail,
} from '@/lib/wordpress-content';
import type { ContentDetail, ContentFamily, WPPage, WPPost } from '@/types/wordpress';

function getDetailPath(family: ContentFamily, slug: string): string {
  if (family === 'service') {
    return `/pages?slug=${encodeURIComponent(slug)}&_embed&per_page=1`;
  }

  const categoryId =
    family === 'insight'
      ? WORDPRESS_CATEGORY_IDS.insights
      : family === 'case'
        ? WORDPRESS_CATEGORY_IDS.cases
        : WORDPRESS_CATEGORY_IDS.partners;

  return `/posts?slug=${encodeURIComponent(slug)}&categories=${categoryId}&_embed&per_page=1`;
}

export function useContentDetail(family: ContentFamily, slug?: string) {
  const [state, dispatch] = useReducer(detailReducer, initialDetailState);

  useEffect(() => {
    if (!slug) {
      dispatch({ type: 'reset' });
      return;
    }

    const controller = new AbortController();

    dispatch({ type: 'start' });

    if (family === 'service') {
      wpFetch<WPPage[]>(getDetailPath(family, slug), controller.signal)
        .then((pages) => {
          const page = pages[0];
          dispatch({
            type: 'success',
            item: page ? normalizeDetail(family, page) : null,
          });
        })
        .catch((err) => {
          if (err instanceof DOMException && err.name === 'AbortError') {
            return;
          }

          dispatch({ type: 'error', error: err as Error });
        });

      return () => controller.abort();
    }

    wpFetch<WPPost[]>(getDetailPath(family, slug), controller.signal)
      .then((posts) => {
        const post = posts.find((entry) => isSupportedPostFamily(entry, family));
        dispatch({
          type: 'success',
          item: post ? normalizeDetail(family, post) : null,
        });
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        dispatch({ type: 'error', error: err as Error });
      });

    return () => controller.abort();
  }, [family, slug]);

  return state;
}

interface DetailState {
  item: ContentDetail | null;
  loading: boolean;
  error: Error | null;
}

type DetailAction =
  | { type: 'start' }
  | { type: 'success'; item: ContentDetail | null }
  | { type: 'error'; error: Error }
  | { type: 'reset' };

const initialDetailState: DetailState = {
  item: null,
  loading: true,
  error: null,
};

function detailReducer(state: DetailState, action: DetailAction): DetailState {
  switch (action.type) {
    case 'start':
      return {
        item: null,
        loading: true,
        error: null,
      };
    case 'success':
      return {
        item: action.item,
        loading: false,
        error: null,
      };
    case 'error':
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case 'reset':
      return {
        item: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
}