import { atom, type AtomEffect, selector } from 'recoil';
import { PlaybackState } from './types.d';

// player

export const playerStateAtom = atom<PlaybackState | null>({
  key: 'playerState',
  default: null,
});

export const playerTrackAtom = atom<any | null>({
  key: 'playerTrack',
  default: null,
});

// non-player

export const likedIdsState = atom({
  key: 'likedIds',
  default: new Set(),
});

export const albumState = atom<string | null>({
  key: 'album',
  default: null,
});

export const loadingState = atom<boolean>({
  key: 'loading',
  default: false,
});

export const loadingTrackPreview = atom<boolean>({
  key: 'loadingTrackPreview',
  default: false,
});

export const trackPreviewState = atom<{
  url: string;
  context: any;
  state: 'playing' | 'pause';
} | null>({
  key: 'trackPreview',
  default: null,
});

export const deviceIdAtom = atom<string | null>({
  key: 'deviceId',
  default: null,
});

export const playTrackPreviewsState = atom<boolean>({
  key: 'playTrackPreviews',
  default: true,
});

export const trackPreviewUrlSelector = selector({
  key: 'trackPreviewUrl',
  get: ({ get }) => get(trackPreviewState),
  set: ({ get, set }, newValue) => {
    if (newValue === get(trackPreviewState)) {
      set(trackPreviewState, null);
    } else {
      set(trackPreviewState, newValue);
    }
  },
});

const localStorageEffect =
  <T>(key: string): AtomEffect<T> =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue !== null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const tokenState = atom({
  key: 'token',
  default: '',
  effects: [localStorageEffect<string>('token')],
});

export const userState = selector<{
  email: string;
  photoUrl: string;
  displayName: string;
} | null>({
  key: 'user',
  get: async ({ get }) => {
    try {
      const req = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${get(tokenState)}`,
        },
      });

      if (!req.ok) {
        return null;
      }

      return await req.json();
    } catch {
      return null;
    }
  },
});
