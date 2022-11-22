import Icon from '@mdi/react';
import { IconButton } from '@mui/material';
import { memo } from 'react';
import {
  mdiCardsHeart,
  mdiCardsHeartOutline,
  mdiSpotify,
  mdiThumbDown,
  mdiThumbDownOutline,
} from '@mdi/js';
import { useEventBus } from '../EventBus';

interface Props {
  track: any;
}

export const ActionsColumn = memo(({ track }: Props) => {
  const eventBus = useEventBus();

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
        onClick={() => eventBus.emit('saveTrack', track)}
      >
        <Icon
          path={track.isLiked ? mdiCardsHeart : mdiCardsHeartOutline}
          size={1}
        />
      </IconButton>
      <IconButton
        size="small"
        aria-label="Ignore"
        onClick={() => eventBus.emit('ignoreTrack', track)}
      >
        <Icon
          path={track.isIgnored ? mdiThumbDown : mdiThumbDownOutline}
          size={1}
        />
      </IconButton>
    </>
  );
});
