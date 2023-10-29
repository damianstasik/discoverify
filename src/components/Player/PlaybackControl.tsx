import mdiPauseCircle from "@slimr/mdi-paths/PauseCircle";
import mdiPlayCircle from "@slimr/mdi-paths/PlayCircle";
import mdiRepeat from "@slimr/mdi-paths/Repeat";
import mdiShuffle from "@slimr/mdi-paths/Shuffle";
import mdiSkipNext from "@slimr/mdi-paths/SkipNext";
import mdiSkipPrevious from "@slimr/mdi-paths/SkipPrevious";
import { memo } from "react";
import { IconButton } from "../IconButton";

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
