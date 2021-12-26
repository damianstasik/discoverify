import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const loadingState = atom(false);

export const trackPreviewState = atom<{ url: string; context: any } | null>(
  null,
);

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

export const tokenIdState = atomWithStorage('tid', '');

export const userSelector = atom<{
  id: string;
  displayName: string;
  email: string;
  photoUrl: string | null;
} | null>(async (get) => {
  const tokenId = get(tokenIdState);

  if (!tokenId) {
    return null;
  }

  const req = await fetch(
    `${import.meta.env.VITE_API_URL}/me?tokenId=${tokenId}`,
  );

  if (!req.ok) {
    return null;
  }

  const res = req.json();

  return res;
});
