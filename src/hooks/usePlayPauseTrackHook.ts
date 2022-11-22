import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { playTrack } from '../api';
import { useEventBus } from '../components/EventBus';
import { deviceIdAtom, tokenState } from '../store';

export function usePlayPauseTrackHook(ids: string[]) {
  const eventBus = useEventBus();
  const deviceId = useRecoilValue(deviceIdAtom);
  const token = useRecoilValue(tokenState);
  const { mutate } = useMutation(playTrack);

  const play = useCallback<(offset: string) => void>(
    (offset) =>
      mutate({
        token,
        ids,
        offset,
        deviceId,
      }),
    [token, ids, deviceId],
  );

  useEffect(() => {
    eventBus.on('playPauseTrack', play);

    return () => {
      eventBus.off('playPauseTrack', play);
    };
  }, [play]);
}
