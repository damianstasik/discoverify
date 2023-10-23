import { type AtomEffect, atom, selector } from "recoil";

// queue

export const queueVisibilityAtom = atom<boolean>({
  key: "queueVisibility",
  default: false,
});

// non-player

export const deviceIdAtom = atom<string | null>({
  key: "deviceId",
  default: null,
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
  key: "token",
  default: "",
});

export const userAtom = atom<Output<"auth.me"> | null>({
  key: "user",
  default: null,
});

export const playerVolumeAtom = atom<number>({
  key: "playerVolume",
  default: 0.8,
  effects: [localStorageEffect<number>("playerVolume")],
});

export const savedTracksAtom = atom<string[]>({
  key: "savedTracks",
  default: [],
});

export const savedTracksSelector = selector({
  key: "savedTracksSelector",
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
