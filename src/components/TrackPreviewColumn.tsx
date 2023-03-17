import { mdiPauseCircle, mdiPlayCircle } from '@mdi/js';
import { useRecoilValue } from 'recoil';
import { playerStateAtom, playerTrackAtom } from '../store';
import { PlaybackState } from '../types.d';
import { useEventBus } from './EventBus';
import { CellContext } from '@tanstack/react-table';
import { IconButton } from './IconButton';
import { twMerge } from 'tailwind-merge';
import { CircularProgress } from './CircularProgress';

export const TrackPreviewColumn = <Data,>(props: CellContext<Data, string>) => {
  const uri = props.getValue();
  const eventBus = useEventBus();
  const playerTrack = useRecoilValue(playerTrackAtom);
  const isPlayingTrack = playerTrack?.uri === uri; // && trackPreview?.context === context
  const playerState = useRecoilValue(playerStateAtom);

  return isPlayingTrack && playerState === PlaybackState.LOADING ? (
    <CircularProgress />
  ) : (
    <IconButton
      icon={
        isPlayingTrack && playerState === PlaybackState.PLAYING
          ? mdiPauseCircle
          : mdiPlayCircle
      }
      className={twMerge(
        'p-1',
        isPlayingTrack ? 'text-green-500' : 'text-white',
      )}
      onClick={() => eventBus.emit('playPauseTrack', uri)}
      label={isPlayingTrack ? 'Pause' : 'Play'}
    />
  );
};
