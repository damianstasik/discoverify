import { Combobox } from '@headlessui/react';
import { Icon } from './Icon';
import { mdiMenuDown } from '@mdi/js';
import { twMerge } from 'tailwind-merge';

const Option = ({ item }) => {
  switch (item.type) {
    case 'track':
      return (
        <Combobox.Option
          className={({ active }) =>
            twMerge(
              'text-white px-3 py-2 flex items-center gap-3',
              active && 'bg-neutral-750',
            )
          }
          value={item}
        >
          <img src={item.img} className="s-8 rounded" alt={item.name} />
          <div className="flex flex-col">
            <p>{item.name}</p>
            <p className="text-xs text-neutral-300">
              {item.artists.map((artist: any) => artist.name).join(', ')}
            </p>
          </div>
        </Combobox.Option>
      );
    case 'genre':
      return (
        <Combobox.Option
          className={({ active }) =>
            twMerge(
              'text-white px-3 py-2 flex items-center gap-3',
              active && 'bg-neutral-750',
            )
          }
          value={item}
        >
          {item.label}
        </Combobox.Option>
      );
    case 'artist':
      return (
        <Combobox.Option
          className={({ active }) =>
            twMerge(
              'text-white px-3 py-2 flex items-center gap-3',
              active && 'bg-neutral-750',
            )
          }
          value={item}
        >
          <img src={item.img} className="s-8 rounded" alt={item.label} />
          <div>{item.label}</div>
        </Combobox.Option>
      );
  }
};

const groups = {
  genre: 'Genres',
  track: 'Tracks',
  artist: 'Artists',
};

export function EntityAutocomplete({
  tracks,
  isDisabled,
  isLoading,
  query,
  onQueryChange,
  onTrackSelection,
  className,
}) {
  const items = tracks.reduce((acc, item) => {
    if (acc[item.type]) {
      acc[item.type].push(item);
    } else {
      acc[item.type] = [item];
    }

    return acc;
  }, {});

  return (
    <Combobox onChange={onTrackSelection}>
      <div className={twMerge('relative z-10', className)}>
        <div className="relative w-full  overflow-hidden rounded-lg border border-neutral-750 bg-neutral-950 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            className="w-full border-none bg-transparent py-2 pl-3 pr-10 text-sm leading-5 placeholder-neutral-500 text-white focus:ring-0"
            displayValue={(person) => ''}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by tracks, artists or genres..."
          />
          <Combobox.Button className="absolute inset-y-0 right-2 flex items-center">
            <Icon
              path={mdiMenuDown}
              className="s-6 text-neutral-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Combobox.Options className="absolute mt-1 max-h-96 w-full overflow-auto rounded-md bg-neutral-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {tracks.length === 0 && query !== '' ? (
            <div className="relative  select-none py-2 px-4 text-white">
              Nothing found.
            </div>
          ) : (
            Object.entries(items).map(([type, trs]) => (
              <div key={type} className="">
                <h5 className="text-white uppercase text-xs font-semibold px-3 py-2">
                  {groups[type]}
                </h5>
                <div className="flex flex-col">
                  {trs.map((track) => (
                    <Option key={track.id} item={track} />
                  ))}
                </div>
              </div>
            ))
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  );
}