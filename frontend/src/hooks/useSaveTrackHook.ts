import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { saveTrack, unsaveTrack } from '../api';
import { useEventBus } from '../components/EventBus';

export function useSaveTrackHook() {
  const eventBus = useEventBus();
  const { mutate: saveTrackMutation } = useMutation(saveTrack);
  const { mutate: unsaveTrackMutation } = useMutation(unsaveTrack);

  useEffect(() => {
    const handle = ({ id, isSaved }) => {
      if (isSaved) {
        unsaveTrackMutation(id);
      } else {
        saveTrackMutation(id);
      }
    };

    eventBus.on('saveTrack', handle);

    return () => {
      eventBus.off('saveTrack', handle);
    };
  }, []);
}
