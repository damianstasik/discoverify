import { mdiThumbDown, mdiThumbDownOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { IconButton } from '@mui/material';
import { CellContext } from '@tanstack/react-table';
import { useEventBus } from './EventBus';

export const IgnoreColumn = <Data extends { id: string }>(
  props: CellContext<Data, boolean>,
) => {
  const eventBus = useEventBus();
  const isIgnored = props.getValue();

  return (
    <IconButton
      size="small"
      aria-label="Ignore"
      onClick={() => eventBus.emit('ignoreTrack', props.row.original.id)}
    >
      <Icon path={isIgnored ? mdiThumbDown : mdiThumbDownOutline} size={1} />
    </IconButton>
  );
};
