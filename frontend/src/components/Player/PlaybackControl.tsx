import { memo } from 'react';
import { IconButton } from '../IconButton';
import {
  mdiPauseCircle,
  mdiPlayCircle,
  mdiRepeat,
  mdiShuffle,
  mdiSkipNext,
  mdiSkipPrevious,
} from '@mdi/js';

interface Props {
  isPlaying: boolean;
  onPlayPauseClick: () => void;
  onPreviousClick: () => void;
  onNextClick: () => void;
}

export const PlaybackControl = memo(
  ({ isPlaying, onPlayPauseClick, onNextClick, onPreviousClick }: Props) => {
    return (
      <div className="gap-2 flex items-center text-white">
        <IconButton icon={mdiShuffle} />

        <IconButton icon={mdiSkipPrevious} onClick={onPreviousClick} />

        <IconButton
          icon={isPlaying ? mdiPauseCircle : mdiPlayCircle}
          onClick={onPlayPauseClick}
          className="s-10"
        />

        <IconButton icon={mdiSkipNext} onClick={onNextClick} />

        <IconButton icon={mdiRepeat} />
      </div>
    );
  },
);
