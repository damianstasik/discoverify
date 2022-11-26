import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { saveTrack } from '../api';
import { useEventBus } from '../components/EventBus';

export function useSaveTrackHook() {
  const eventBus = useEventBus();
  const { mutate } = useMutation(saveTrack);

  useEffect(() => {
    eventBus.on('saveTrack', mutate);

    return () => {
      eventBus.off('saveTrack', mutate);
    };
  }, []);
}
