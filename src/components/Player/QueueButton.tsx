import * as Popover from '@radix-ui/react-popover';
import { IconButton } from '../IconButton';
import { mdiClose, mdiPlaylistMusicOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { Link } from 'react-router-dom';

function ArtistLink({ id, name }) {
  return (
    <Link
      to={`/artist/${id}`}
      className="text-neutral-300 underline decoration-neutral-500"
    >
      {name}
    </Link>
  );
}

export function QueueButton({ queue, isOpen, onVisibilityChange }) {
  return (
    <Popover.Root open={isOpen} onOpenChange={onVisibilityChange}>
      <Popover.Trigger asChild>
        <IconButton
          icon={mdiPlaylistMusicOutline}
          onClick={() => onVisibilityChange(true)}
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="rounded-md p-5 w-86 bg-neutral-700"
          sideOffset={5}
          collisionPadding={10}
        >
          <ul role="list" className="flex flex-col gap-2">
            {(queue || []).map((track) => (
              <li key={track.id} className="flex items-center">
                <img
                  className="h-8 w-8 rounded-md"
                  src={track.album?.images?.[0].url}
                  alt=""
                />
                <div className="ml-3 text-sm">
                  <p className="text-white">{track.name}</p>
                  <div className="flex gap-1">
                    {track.artists?.map((artist) => (
                      <ArtistLink
                        id={artist.id}
                        name={artist.name}
                        key={artist.id}
                      />
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Popover.Close
            className="rounded-full h-8 w-8 p-1 inline-flex items-center justify-center text-neutral-500 hover:text-neutral-200 absolute top-2 right-2 hover:bg-white/10 outline-none"
            aria-label="Close"
          >
            <Icon path={mdiClose} />
          </Popover.Close>
          <Popover.Arrow className="fill-neutral-700" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
