import { mdiSpotify } from '@mdi/js';
import Icon from '@mdi/react';
import { IconButton } from '@mui/material';
import { CellContext } from '@tanstack/react-table';

export const SpotifyLinkColumn = <Data,>(props: CellContext<Data, string>) => {
  return (
    <IconButton
      size="small"
      aria-label="Open in Spotify"
      href={props.getValue()}
      target="_blank"
    >
      <Icon path={mdiSpotify} size={1} />
    </IconButton>
  );
};
