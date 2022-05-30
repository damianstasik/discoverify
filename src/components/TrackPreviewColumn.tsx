import { mdiPauseCircleOutline, mdiPlayCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import IconButton from '@mui/material/IconButton';
import { useAtom, useAtomValue } from 'jotai';
import { memo } from 'react';
import { loadingTrackPreview, trackPreviewState } from '../store';

interface Props {
  url: string | null;
  context: any;
}

export const TrackPreviewColumn = memo(({ url, context }: Props) => {
  const [trackPreview, setTrackPreview] = useAtom(trackPreviewState);
  const isLoadingTrackPreview = useAtomValue(loadingTrackPreview);

  const isCurrentlyPlaying =
    trackPreview?.url === url && trackPreview?.context === context;

  if (!url) {
    return null;
  }

  const handleClick = () =>
    setTrackPreview({
      url,
      context,
      state: 'playing',
    });

  return (
    <IconButton
      color={isCurrentlyPlaying ? 'primary' : 'default'}
      onClick={handleClick}
      disabled={isLoadingTrackPreview}
      aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
    >
      <Icon
        path={
          isCurrentlyPlaying && trackPreview?.state === 'playing'
            ? mdiPauseCircleOutline
            : mdiPlayCircleOutline
        }
        size={1}
      />
    </IconButton>
  );
});
