import { Combobox } from "@headlessui/react";
import { mdiMenuDown } from "@mdi/js";
import { tw } from "../tw";
import { Icon } from "./Icon";

interface Item {
  type: "artist" | "track" | "genre";
  id: string;
  label: string;
  [key: string]: any;
}

const Option = ({ item }: { item: Item }) => {
  switch (item.type) {
    case "track":
      return (
        <Combobox.Option
          className={({ active }) =>
            tw(
              "text-white px-3 py-2 flex items-center gap-3 cursor-pointer",
              active && "bg-slate-500/50",
            )
          }
          value={item}
        >
          <img src={item.img} className="s-8 rounded" alt={item.name} />
          <div className="flex flex-col">
            <p>{item.name}</p>
            <p className="text-xs text-slate-300">
              {item.artists.map((artist: any) => artist.name).join(", ")}
            </p>
          </div>
        </Combobox.Option>
      );
    case "genre":
      return (
        <Combobox.Option
          className={({ active }) =>
            tw(
              "text-white px-3 py-2 flex items-center gap-3 cursor-pointer",
              active && "bg-slate-500/50",
            )
          }
          value={item}
        >
          {item.label}
        </Combobox.Option>
      );
    case "artist":
      return (
        <Combobox.Option
          className={({ active }) =>
            tw(
              "text-white px-3 py-2 flex items-center gap-3 cursor-pointer",
              active && "bg-slate-500/50",
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
  genre: "Genres",
  track: "Tracks",
  artist: "Artists",
} as const;

interface Props {
  seeds: Item[];
  isDisabled?: boolean;
  isLoading?: boolean;
  query: string;
  onQueryChange: (query: string) => void;
  onSelection: (item: Item) => void;
  className?: string;
}

export function EntityAutocomplete({
  seeds,
  isDisabled,
  isLoading,
  query,
  onQueryChange,
  onSelection,
  className,
}: Props) {
  const groupedSeeds = seeds.reduce((acc, seed) => {
    if (acc[seed.type]) {
      acc[seed.type].push(seed);
    } else {
      acc[seed.type] = [seed];
    }

    return acc;
  }, {});

  return (
    <Combobox onChange={onSelection}>
      <div className={tw("relative z-10", className)}>
        <div className="relative w-full overflow-hidden rounded-lg border border-slate-600 bg-slate-950 text-left focus:outline-none">
          <Combobox.Input
            className="w-full border-none bg-transparent py-2 pl-3 pr-10 text-sm/5 placeholder-slate-450 text-white focus:ring-0"
            displayValue={(person) => ""}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by tracks, artists or genres..."
          />
          <Combobox.Button className="absolute inset-y-0 right-2 flex items-center">
            <Icon
              path={mdiMenuDown}
              className="s-6 text-slate-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Combobox.Options className="absolute mt-1 max-h-96 w-full overflow-auto rounded-md bg-slate-500/50 backdrop-blur-lg text-sm focus:outline-none">
          {seeds.length === 0 && query !== "" ? (
            <div className="relative  select-none py-2 px-4 text-white">
              Nothing found.
            </div>
          ) : (
            Object.entries(groupedSeeds).map(([type, seeds]) => (
              <div key={type} className="">
                <h5 className="text-white uppercase text-xs font-semibold px-3 py-2">
                  {groups[type]}
                </h5>
                <div className="flex flex-col">
                  {seeds.map((track) => (
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
