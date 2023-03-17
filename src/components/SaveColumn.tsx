import { mdiCardsHeart, mdiCardsHeartOutline } from '@mdi/js';
import { CellContext } from '@tanstack/react-table';
import { useEventBus } from './EventBus';
import { IconButton } from './IconButton';

export function SaveColumn<Data extends { id: string }>(
  props: CellContext<Data, boolean>,
) {
  const eventBus = useEventBus();
  const isSaved = props.getValue();

  return (
    <IconButton
      icon={isSaved ? mdiCardsHeart : mdiCardsHeartOutline}
      label="Save"
      onClick={() => eventBus.emit('saveTrack', props.row.original.id)}
      className="p-1 text-white"
    />
  );
}
