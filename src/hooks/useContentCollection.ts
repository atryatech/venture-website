import { useEffect, useReducer } from 'react';

import { wpFetch } from '@/lib/wordpress';
import {
  WORDPRESS_CATEGORY_IDS,
  WORDPRESS_SERVICE_PARENT_ID,
  normalizeSummary,
  sortServicePages,
} from '@/lib/wordpress-content';
import type { ContentFamily, ContentSummary, WPPage, WPPost } from '@/types/wordpress';

function getCollectionPath(family: ContentFamily): string {
  if (family === 'service') {
    return `/pages?parent=${WORDPRESS_SERVICE_PARENT_ID}&_embed&per_page=100&orderby=menu_order&order=asc`;
  }

  const categoryId =
    family === 'insight'
      ? WORDPRESS_CATEGORY_IDS.insights
      : family === 'case'
        ? WORDPRESS_CATEGORY_IDS.cases
        : WORDPRESS_CATEGORY_IDS.partners;

  return `/posts?categories=${categoryId}&_embed&per_page=100&orderby=date&order=desc`;
}

export function useContentCollection(family: ContentFamily) {
  const [state, dispatch] = useReducer(collectionReducer, initialCollectionState);

  useEffect(() => {
    const controller = new AbortController();

    dispatch({ type: 'start' });

    if (family === 'service') {
      wpFetch<WPPage[]>(getCollectionPath(family), controller.signal)
        .then((pages) => {
          dispatch({
            type: 'success',
            items: sortServicePages(pages).map((page) => normalizeSummary(family, page)),
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

    wpFetch<WPPost[]>(getCollectionPath(family), controller.signal)
      .then((posts) => {
        dispatch({
          type: 'success',
          items: posts.map((post) => normalizeSummary(family, post)),
        });
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        dispatch({ type: 'error', error: err as Error });
      });

    return () => controller.abort();
  }, [family]);

  return state;
}

interface CollectionState {
  items: ContentSummary[];
  loading: boolean;
  error: Error | null;
}

type CollectionAction =
  | { type: 'start' }
  | { type: 'success'; items: ContentSummary[] }
  | { type: 'error'; error: Error };

const initialCollectionState: CollectionState = {
  items: [],
  loading: true,
  error: null,
};

function collectionReducer(state: CollectionState, action: CollectionAction): CollectionState {
  switch (action.type) {
    case 'start':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'success':
      return {
        items: action.items,
        loading: false,
        error: null,
      };
    case 'error':
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
}