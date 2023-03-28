import { atom, type AtomEffect, selector, atomFamily } from 'recoil';
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

// queue

export const queueVisibilityAtom = atom<boolean>({
  key: 'queueVisibility',
  default: false,
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

/** @deprecated */
export const tokenState = atom({
  key: 'token',
  default: '',
});

export const userAtom = atom<Output<'auth.me'> | null>({
  key: 'user',
  default: null,
});

export const playerVolumeAtom = atom<number>({
  key: 'playerVolume',
  default: 0.8,
  effects: [localStorageEffect<number>('playerVolume')],
});

export const savedTracksAtom = atom<string[]>({
  key: 'savedTracks',
  default: [],
});

export const savedTracksSelector = selector({
  key: 'savedTracksSelector',
  get: ({ get, getCallback }) => {
    const savedTracks = get(savedTracksAtom);

    return getCallback(() => (id) => savedTracks.includes(id));
  },
  set: ({ get, set }, newValue) => {
    const savedTracks = get(savedTracksAtom);

    if (savedTracks.includes(newValue)) {
      set(
        savedTracksAtom,
        savedTracks.filter((id) => id !== newValue),
      );
    } else {
      set(savedTracksAtom, [...savedTracks, newValue]);
    }
  },
});

export const trackStateAtom = atomFamily({
  key: 'trackState',
  default: { isPlaying: false, isLoading: false },
});
