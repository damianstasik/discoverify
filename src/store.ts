import { atom, type AtomEffect, selector } from 'recoil';

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

export const deviceIdState = atom<string>({
  key: 'deviceId',
  default: '',
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
