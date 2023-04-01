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
    <div className="shadow-inner h-12 pl-2 pr-1 bg-slate-500 rounded-md flex-shrink-0 flex items-center gap-2 relative overflow-hidden">
      <img
        className="absolute left-0 top-0 w-full h-full object-cover object-center blur opacity-25"
        src={imageUrl}
        alt={name}
      />
      <div className="relative">
        <img className="rounded s-8" src={imageUrl} alt={name} />
      </div>
      <div className="relative flex justify-center flex-col gap-1">
        <Link to={`/artist/${id}`} className="text-white text-sm">
          {name}
        </Link>
      </div>
      <div className="relative">
        <IconButton
          icon={mdiClose}
          label="Remove"
          className="text-slate-400"
          onClick={onRemove}
        />
      </div>
    </div>
  );
};
