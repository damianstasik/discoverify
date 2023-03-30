import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { playTrack } from '../api';
import { useEventBus } from '../components/EventBus';
import { deviceIdAtom } from '../store';
import { trpc } from '../trpc';
import { player } from '../state';

export function usePlayPauseTrackHook(trackIds: string[]) {
  const eventBus = useEventBus();
  const deviceId = useRecoilValue(deviceIdAtom);

  const { mutate: play } = useMutation(playTrack, {
    onError() {
      player.resetLoadingTrackId();
    },
  });

  const { mutate: pause } = useMutation(
    () => {
      return trpc.track.pause.mutate(deviceId);
    },
    {
      onSuccess() {
        player.resetPlayingTrackId();
      },
      onSettled() {
        player.resetLoadingTrackId();
      },
    },
  );

  const handler = useCallback(
    ({ uri, isPlaying }) => {
      player.setLoadingTrackId(uri);

      if (isPlaying) {
        pause();
      } else {
        play({
          trackIds,
          offset: uri,
          deviceId,
        });
      }
    },
    [trackIds, deviceId],
  );

  useEffect(() => {
    eventBus.on('playPauseTrack', handler);

    return () => {
      eventBus.off('playPauseTrack', handler);
    };
  }, [handler]);
}
