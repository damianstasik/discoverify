import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { playTrack } from '../api';
import { useEventBus } from '../components/EventBus';
import {
  deviceIdAtom,
  playerStateAtom,
  playerTrackAtom,
  trackStateAtom,
} from '../store';
import { PlaybackState } from '../types.d';
import { trpc } from '../trpc';

export function usePlayPauseTrackHook(trackIds: string[]) {
  const eventBus = useEventBus();
  const deviceId = useRecoilValue(deviceIdAtom);
  const { mutate } = useMutation(playTrack);
  const { mutate: pause } = useMutation(() => {
    return trpc.track.pause.mutate(deviceId);
  });

  const play = useRecoilCallback(
    ({ set }) =>
      ({ uri, isPlaying, isLoading }) => {
        set(trackStateAtom(uri), {
          isPlaying: !isPlaying,
          isLoading: true,
        });

        if (isPlaying) {
          pause();
        } else {
          mutate({
            trackIds,
            offset: uri,
            deviceId,
          });
        }
      },
    [trackIds, deviceId],
  );

  useEffect(() => {
    eventBus.on('playPauseTrack', play);

    return () => {
      eventBus.off('playPauseTrack', play);
    };
  }, [play]);
}
