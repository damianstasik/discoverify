import { Link } from 'react-router-dom';
import { IconButton } from './IconButton';
import { mdiClose } from '@mdi/js';

interface Props {
  id: string;
  name: string;
  imageUrl: string;
  onRemove: () => void;
}

export const ArtistChip = ({ id, name, imageUrl, onRemove }: Props) => {
  return (
    <div className="h-12 pl-2 pr-1 bg-neutral-750 rounded-md flex-shrink-0 flex items-center gap-2">
      <div>
        <img className="rounded s-8" src={imageUrl} alt={name} />
      </div>
      <div className="flex justify-center flex-col gap-1">
        <Link to={`/track/${id}`} className="text-white text-sm">
          {name}
        </Link>
      </div>
      <div>
        <IconButton
          icon={mdiClose}
          label="Remove"
          className="text-neutral-400"
          onClick={onRemove}
        />
      </div>
    </div>
  );
};
