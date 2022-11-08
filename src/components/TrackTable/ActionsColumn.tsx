import Icon from '@mdi/react';
import { IconButton } from '@mui/material';
import { useGridApiContext } from '@mui/x-data-grid-premium';
import { memo } from 'react';
import {
  mdiCardsHeart,
  mdiCardsHeartOutline,
  mdiSpotify,
  mdiThumbDown,
  mdiThumbDownOutline,
} from '@mdi/js';

interface Props {
  track: any;
}

export const ActionsColumn = memo(({ track }: Props) => {
  const apiRef = useGridApiContext();

  return (
    <>
      <IconButton
        size="small"
        aria-label="Open in Spotify"
        href={track.uri}
        target="_blank"
      >
        <Icon path={mdiSpotify} size={1} />
      </IconButton>
      <IconButton
        size="small"
        aria-label="Save"
        onClick={() => apiRef.current.publishEvent('saveTrack', track)}
      >
        <Icon
          path={track.isLiked ? mdiCardsHeart : mdiCardsHeartOutline}
          size={1}
        />
      </IconButton>
      <IconButton
        size="small"
        aria-label="Ignore"
        onClick={() => apiRef.current.publishEvent('ignoreTrack', track)}
      >
        <Icon
          path={track.isIgnored ? mdiThumbDown : mdiThumbDownOutline}
          size={1}
        />
      </IconButton>
    </>
  );
});
