import { mdiCardsHeart, mdiCardsHeartOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { IconButton } from '@mui/material';
import { CellContext } from '@tanstack/react-table';
import { useEventBus } from './EventBus';

export function SaveColumn<Data extends { id: string }>(
  props: CellContext<Data, boolean>,
) {
  const eventBus = useEventBus();
  const isSaved = props.getValue();

  return (
    <IconButton
      size="small"
      aria-label="Save"
      onClick={() => eventBus.emit('saveTrack', props.row.original.id)}
    >
      <Icon path={isSaved ? mdiCardsHeart : mdiCardsHeartOutline} size={1} />
    </IconButton>
  );
}
