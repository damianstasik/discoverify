import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { atomWithQuery } from 'jotai/query';

export const loadingState = atom(false);

export const loadingTrackPreview = atom(false);

export const trackPreviewState = atom<{
  url: string;
  context: any;
  state: 'playing' | 'pause';
} | null>(null);

export const deviceIdState = atom('');

export const playTrackPreviewsState = atom(true);

export const trackPreviewUrlSelector = atom(
  (get) => get(trackPreviewState),

  (get, set, newValue) => {
    if (newValue === get(trackPreviewState)) {
      set(trackPreviewState, '');
    } else {
      set(trackPreviewState, newValue);
    }
  },
);

export const tokenState = atomWithStorage('token', '');

export const userAtom = atomWithQuery((get) => ({
  queryKey: ['user', get(tokenState)],
  queryFn: async ({ queryKey: [, token] }) => {
    const req = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!req.ok) {
      return null;
    }

    const res = req.json();

    return res;
  },
}));
