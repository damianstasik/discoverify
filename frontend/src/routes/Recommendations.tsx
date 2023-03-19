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
import { IgnoreColumn } from '../components/IgnoreColumn';
import { SaveColumn } from '../components/SaveColumn';
import { RecommendationAttribute } from '../components/RecommendationAttribute';
import { ArtistColumn } from '../components/ArtistColumn';
import { getArtists } from '../api/artist';
import { ArtistChip } from '../components/ArtistChip';
import { ArtistChipSkeleton } from '../components/ArtistChipSkeleton';

type TrackType = RouterOutput['track']['recommended'][number];

const columnHelper = createColumnHelper<TrackType>();

const columns = [
  columnHelper.display({
    size: 50,
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
    cell: ArtistColumn,
  }),
  // columnHelper.accessor('album', {
  //   header: 'Album',
  //   cell: AlbumColumn,
  // }),
  columnHelper.accessor('duration', {
    header: 'Duration',
    cell: DurationColumn,
  }),
  columnHelper.accessor('isLiked', {
    header: '',
    size: 40,
    cell: SaveColumn,
  }),
  columnHelper.accessor('isIgnored', {
    header: '',
    size: 40,
    cell: IgnoreColumn,
  }),
  columnHelper.accessor('uri', {
    id: 'open',
    header: '',
    size: 40,
    cell: SpotifyLinkColumn,
  }),
];

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

  // useSaveTrackHook();

  const seeds = [
    ...trackIds.map((id) => ({ type: 'track', id })),
    ...artistIds.map((id) => ({ type: 'artist', id })),
    ...genreIds.map((id) => ({ type: 'genre', id })),
  ];

  return (
    <>
      <div className="p-3 bg-neutral-875 border-b border-neutral-800">
        <EntityAutocomplete
          tracks={search.data || []}
          isDisabled={trackIds.length > 5}
          isLoading={search.isFetching}
          query={query}
          onQueryChange={setQuery}
          onSelection={(b) => {
            const q = new URLSearchParams(searchParams);
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
            setSearchParams(q);
          }}
        />

        <div className="flex mt-3">
          <div className="w-1/2">
            {seeds.length > 0 && (
              <div>
                <h5 className="uppercase text-neutral-400 text-xs font-semibold pb-3 tracking-wide">
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
                        const q = new URLSearchParams();
                        trackIds.forEach((trackId) => {
                          if (trackId !== track.id) {
                            q.append('trackId', trackId);
                          }
                        });
                        setSearchParams(q);
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
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="w-1/2">
            <h5 className="uppercase text-neutral-400 text-xs font-semibold pb-3 tracking-wide">
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
