import { makeAutoObservable } from 'mobx';
import { attributes } from './config/attributes';

class Player {
  loadingTrackId: string | null = null;
  playingTrackId: string | null = null;

  constructor() {
    makeAutoObservable(this);
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
