import { makeAutoObservable } from "mobx";

class Player {
  loadingTrackId: string | null = null;
  playingTrackId: string | null = null;
  deviceId: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setDeviceId(deviceId: string) {
    this.deviceId = deviceId;
  }

  setLoadingTrackId(trackId: string) {
    this.loadingTrackId = trackId;
  }

  isLoading(trackId?: string) {
    if (!trackId) {
      return !!this.loadingTrackId;
    }

    return this.loadingTrackId === trackId;
  }

  resetLoadingTrackId() {
    this.loadingTrackId = null;
  }

  setPlayingTrackId(trackId: string) {
    this.playingTrackId = trackId;
  }

  isPlaying(trackId?: string) {
    if (!trackId) {
      return !!this.playingTrackId;
    }

    return this.playingTrackId === trackId;
  }

  resetPlayingTrackId() {
    this.playingTrackId = null;
  }
}

export const player = new Player();
