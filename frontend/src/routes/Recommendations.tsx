import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { getRecommendedTracks, getTracks, seedSearch } from '../api';
import { TrackChip } from '../components/TrackChip';
import { EntityAutocomplete } from '../components/EntityAutocomplete';
import { TrackChipSkeleton } from '../components/TrackChipSkeleton';
import { useAttributes } from '../hooks/useAttributes';
import { attributes as attributesConfig } from '../config/attributes';
import { usePlayPauseTrackHook } from '../hooks/usePlayPauseTrackHook';
import { VirtualTable } from '../components/VirtualTable';
import { createColumnHelper } from '@tanstack/react-table';
import { RouterOutput } from '../trpc';
import { DurationColumn } from '../components/DurationColumn';
import { CheckboxColumn } from '../components/CheckboxColumn';
import { SpotifyLinkColumn } from '../components/SpotifyLinkColumn';
import { SaveColumn } from '../components/SaveColumn';
import { RecommendationAttribute } from '../components/RecommendationAttribute';
import { ArtistsColumn } from '../components/ArtistsColumn';
import { getArtists } from '../api/artist';
import { ArtistChip } from '../components/ArtistChip';
import { ArtistChipSkeleton } from '../components/ArtistChipSkeleton';
import { AlbumColumn } from '../components/AlbumColumn';

type TrackType = RouterOutput['track']['recommended'][number];

const columnHelper = createColumnHelper<TrackType>();

const columns = [
  columnHelper.display({
    size: 40,
    id: 'select',
    header: ({ table }) => (
      <CheckboxColumn
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <CheckboxColumn
        {...{
          checked: row.getIsSelected(),
          indeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler(),
        }}
      />
    ),
  }),
  columnHelper.accessor('uri', {
    header: '',
    id: 'preview',
    size: 50,
    cell: TrackPreviewColumn,
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    size: 300,
    cell: TrackNameColumn,
  }),
  columnHelper.accessor('artist', {
    header: 'Artist(s)',
    cell: ArtistsColumn,
    size: 250,
  }),
  columnHelper.accessor('album', {
    header: 'Album',
    cell: AlbumColumn,
    size: 250,
  }),
  columnHelper.accessor('duration', {
    header: 'Duration',
    cell: DurationColumn,
    size: 80,
  }),
  columnHelper.accessor('isLiked', {
    header: '',
    size: 40,
    cell: SaveColumn,
  }),
  columnHelper.accessor('uri', {
    id: 'open',
    header: '',
    size: 40,
    cell: SpotifyLinkColumn,
  }),
];

// Taken from https://github.com/teetotum/url-search-params-delete/blob/4f6380665e20aa77f402e300c5cfad74f4d866aa/index.js#L5-L17 and modified
// to work with useSearchParams hook
const deleteWithKeyAndValue = function (key: string, value: string) {
  return (q: URLSearchParams) => {
    const entriesIterator = q.entries();
    const entries = [...entriesIterator];
    const toBeRestored = entries.filter(
      ([k, v]) => !(k === key && v === value),
    );
    const keysIterator = q.keys();
    const keys = [...keysIterator];
    keys.forEach((k) => q.delete(k));
    toBeRestored.forEach(([k, v]) => q.append(k, v));
    return q;
  };
};

export function Recommendations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 500);

  const { attributes, values } = useAttributes(attributesConfig);

  const trackIds = searchParams.getAll('trackId');
  const artistIds = searchParams.getAll('artistId');
  const genreIds = searchParams.getAll('genres');

  const [recommended, tracks, artists, search] = useQueries({
    queries: [
      {
        queryKey: ['recommendedTracks', trackIds, artistIds, values],
        queryFn: getRecommendedTracks,
        enabled: trackIds.length > 0 || artistIds.length > 0,
      },
      {
        queryKey: ['tracks', trackIds],
        queryFn: getTracks,
        enabled: trackIds.length > 0,
      },
      {
        queryKey: ['artists', artistIds],
        queryFn: getArtists,
        enabled: artistIds.length > 0,
      },
      {
        queryKey: ['seedSearch', debouncedQuery],
        queryFn: seedSearch,
        enabled: !!debouncedQuery,
      },
    ],
  });

  const ids = useMemo(
    () => (recommended.data || []).map((t) => t.uri),
    [recommended.data],
  );

  usePlayPauseTrackHook(ids);

  // useIgnoreTrackHook();

  const seeds = [
    ...trackIds.map((id) => ({ type: 'track', id })),
    ...artistIds.map((id) => ({ type: 'artist', id })),
    ...genreIds.map((id) => ({ type: 'genre', id })),
  ];

  return (
    <>
      <div className="p-3 bg-slate-850 border-b border-slate-700">
        <EntityAutocomplete
          seeds={search.data || []}
          isDisabled={trackIds.length > 5}
          isLoading={search.isFetching}
          query={query}
          onQueryChange={setQuery}
          onSelection={(b) => {
            setSearchParams((q) => {
              switch (b.type) {
                case 'track':
                  q.append('trackId', b.id);
                  break;
                case 'artist':
                  q.append('artistId', b.id);
                  break;
                case 'genre':
                  q.append('genreId', b.id);
                  break;
              }
              return q;
            });
          }}
        />

        <div className="flex mt-3">
          <div className="w-1/2">
            {seeds.length > 0 && (
              <div>
                <h5 className="uppercase text-slate-400 text-xs font-semibold pb-3 tracking-wide">
                  Selected seeds
                </h5>
                <div className="flex flex-wrap gap-2">
                  {!tracks.data &&
                    trackIds.length > 0 &&
                    trackIds.map((id) => <TrackChipSkeleton key={id} />)}
                  {(tracks.data || []).map((track) => (
                    <TrackChip
                      key={track.id}
                      id={track.id}
                      name={track.name}
                      artists={track.artists}
                      imageUrl={track.album.images[0].url}
                      onRemove={() => {
                        setSearchParams(
                          deleteWithKeyAndValue('trackId', track.id),
                        );
                      }}
                    />
                  ))}
                  {!artists.data &&
                    artistIds.length > 0 &&
                    artistIds.map((id) => <ArtistChipSkeleton key={id} />)}
                  {(artists.data || []).map((artist) => (
                    <ArtistChip
                      key={artist.id}
                      id={artist.id}
                      name={artist.name}
                      imageUrl={artist.images[0].url}
                      onRemove={() => {
                        setSearchParams(
                          deleteWithKeyAndValue('artistId', artist.id),
                        );
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="w-1/2">
            <h5 className="uppercase text-slate-400 text-xs font-semibold pb-3 tracking-wide">
              Attributes
            </h5>
            <div className="flex flex-wrap gap-1">
              {attributes.map((attr) => (
                <RecommendationAttribute key={attr.name} attr={attr} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 800 }}>
        {seeds.length > 0 && (
          <VirtualTable
            data={recommended.data || []}
            columns={columns}
            isLoading={recommended.isFetching}
            hasNextPage={false}
            fetchNextPage={null}
            isInitialLoading={true}
          />
        )}
      </div>
    </>
  );
}
