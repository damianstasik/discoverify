"use client";

import { useSearchParams } from "next/navigation";
import { cache, use, useState } from "react";
import { useDebounce } from "use-debounce";
import { seedSearch } from "../../../api";
import { EntityAutocomplete } from "../../../components/EntityAutocomplete";
const a = cache((query: string) =>
  seedSearch({ queryKey: [undefined, query] }),
);

export function SeedAutocomplete() {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const searchParams = useSearchParams();
  let seeds = [];
  if (debouncedQuery) {
    seeds = use(a(debouncedQuery));
  }

  const trackIds = searchParams.getAll("trackId");

  return (
    <EntityAutocomplete
      seeds={seeds}
      isDisabled={trackIds.length > 5}
      isLoading={false}
      query={query}
      onQueryChange={setQuery}
      onSelection={(b) => {
        // setSearchParams((q) => {
        //   switch (b.type) {
        //     case 'track':
        //       q.append('trackId', b.id);
        //       break;
        //     case 'artist':
        //       q.append('artistId', b.id);
        //       break;
        //     case 'genre':
        //       q.append('genreId', b.id);
        //       break;
        //   }
        //   return q;
        // });
      }}
    />
  );
}
