import { mdiPauseCircle, mdiPlayCircle } from '@mdi/js';
import { useRecoilValue } from 'recoil';
import { trackStateAtom } from '../store';
import { useEventBus } from './EventBus';
import { CellContext } from '@tanstack/react-table';
import { IconButton } from './IconButton';
import { twMerge } from 'tailwind-merge';
import { CircularProgress } from './CircularProgress';

export const TrackPreviewColumn = <Data,>(props: CellContext<Data, string>) => {
  const uri = props.getValue();
  const eventBus = useEventBus();
  const { isLoading, isPlaying } = useRecoilValue(trackStateAtom(uri));

  console.log('preview', uri);
  return (
    <IconButton
      icon={isPlaying ? mdiPauseCircle : mdiPlayCircle}
      className={twMerge(
        'p-1',
        isPlaying ? 'text-green-500' : 'text-white',
        isLoading ? 'opacity-50 pointer-events-none' : '',
      )}
      onClick={() =>
        eventBus.emit('playPauseTrack', { uri, isLoading, isPlaying })
      }
      label={isPlaying ? 'Pause' : 'Play'}
    />
  );
};
