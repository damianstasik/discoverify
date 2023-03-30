import { mdiHeart, mdiHeartOutline } from '@mdi/js';
import { CellContext } from '@tanstack/react-table';
import { useEventBus } from './EventBus';
import { IconButton } from './IconButton';
import { useRecoilValue } from 'recoil';
import { savedTracksSelector } from '../store';

export function SaveColumn<Data extends { id: string }>(
  props: CellContext<Data, boolean>,
) {
  const eventBus = useEventBus();
  const getIsSaved = useRecoilValue(savedTracksSelector);
  const isSaved = getIsSaved(props.row.original.id);

  return (
    <IconButton
      icon={isSaved ? mdiHeart : mdiHeartOutline}
      label="Save"
      onClick={() =>
        eventBus.emit('saveTrack', {
          id: props.row.original.id,
          isSaved,
        })
      }
      className={`p-1 ${isSaved ? 'text-white' : 'text-slate-400'}`}
    />
  );
}
