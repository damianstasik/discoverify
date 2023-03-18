import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { playTrack } from '../api';
import { useEventBus } from '../components/EventBus';
import { deviceIdAtom } from '../store';

export function usePlayPauseTrackHook(trackIds: string[]) {
  const eventBus = useEventBus();
  const deviceId = useRecoilValue(deviceIdAtom);
  const { mutate } = useMutation(playTrack);

  const play = useCallback<(offset: string) => void>(
    (offset) =>
      mutate({
        trackIds,
        offset,
        deviceId,
      }),
    [trackIds, deviceId],
  );

  useEffect(() => {
    eventBus.on('playPauseTrack', play);

    return () => {
      eventBus.off('playPauseTrack', play);
    };
  }, [play]);
}
