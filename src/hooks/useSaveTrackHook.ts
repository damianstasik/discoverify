import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { saveTrack } from '../api';
import { useEventBus } from '../components/EventBus';
import { tokenState } from '../store';

export function useSaveTrackHook() {
  const eventBus = useEventBus();
  const token = useRecoilValue(tokenState);
  const { mutate } = useMutation(saveTrack);

  const save = useCallback<(track: any) => void>(
    (track) =>
      mutate({
        token,
        id: track.id,
      }),
    [token],
  );

  useEffect(() => {
    eventBus.on('saveTrack', save);

    return () => {
      eventBus.off('saveTrack', save);
    };
  }, [save]);
}
