import { mdiPauseCircle, mdiPlayCircle } from '@mdi/js';
import { useEventBus } from './EventBus';
import { CellContext } from '@tanstack/react-table';
import { IconButton } from './IconButton';
import { observer } from 'mobx-react-lite';
import { player } from '../state';
import { computed } from 'mobx';

const Component = <Data,>(props: CellContext<Data, string>) => {
  const uri = props.getValue();
  const eventBus = useEventBus();

  const isPlaying = computed(() => player.isPlaying(uri)).get();
  const isLoading = computed(() => player.isLoading(uri)).get();

  console.log('track preview', uri, isPlaying, isLoading);

  return (
    <IconButton
      icon={isPlaying ? mdiPauseCircle : mdiPlayCircle}
      className={
        isPlaying ? 'text-green-500 hover:text-green-600' : 'text-white'
      }
      disabled={isLoading}
      onClick={() => eventBus.emit('playPauseTrack', { uri, isPlaying })}
      label={isPlaying ? 'Pause' : 'Play'}
    />
  );
};

export const TrackPreviewColumn = observer(Component);
