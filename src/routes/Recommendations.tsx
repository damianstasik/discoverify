import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useDebounce } from 'use-debounce';
import produce from 'immer';
import { deviceIdAtom, playerStateAtom, tokenState } from '../store';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { ArtistColumn } from '../components/ArtistColumn';
import { AlbumColumn } from '../components/AlbumColumn';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { PageTitle } from '../components/PageTitle';
import { ActionsColumn } from '../components/TrackTable/ActionsColumn';
import { getRecommendedTracks, getTracks, ignoreTrack, search } from '../api';
import { TrackChip } from '../components/TrackChip';
import { Unstable_Grid2 as Grid, Stack, Typography } from '@mui/material';
import { EntityAutocomplete } from '../components/EntityAutocomplete';
import { TrackChipSkeleton } from '../components/TrackChipSkeleton';
import { PlaybackState } from '../types.d';
import { useAttributes } from '../hooks/useAttributes';
import { attributes as attributesConfig } from '../config/attributes';
import { usePlayPauseTrackHook } from '../hooks/usePlayPauseTrackHook';
import { useIgnoreTrackHook } from '../hooks/useIgnoreTrackHook';
import { useSaveTrackHook } from '../hooks/useSaveTrackHook';
import { VirtualTable } from '../components/VirtualTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { RouterOutput } from '../trpc';
import { DurationColumn } from '../components/DurationColumn';
import { CheckboxColumn } from '../components/CheckboxColumn';
import { SpotifyLinkColumn } from '../components/SpotifyLinkColumn';
import { IgnoreColumn } from '../components/IgnoreColumn';
import { SaveColumn } from '../components/SaveColumn';
import { RecommendationAttribute } from '../components/RecommendationAttribute';

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
  // columnHelper.accessor('artist', {
  //   header: 'Artist(s)',
  //   cell: ArtistColumn,
  // }),
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
  const [selectedSongs, setSelectedSongs] = useState([]);

  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 500);

  const { attributes, values } = useAttributes(attributesConfig);

  const token = useRecoilValue(tokenState);
  const queryClient = useQueryClient();

  const trackIds = searchParams.getAll('trackId');

  const { data, isFetching, isInitialLoading } = useQuery(
    ['recommended', trackIds, values],
    getRecommendedTracks,
    {
      enabled: trackIds.length > 0,
    },
  );

  const { data: songs, isLoading: isLoadingTracks } = useQuery(
    ['songs', trackIds],
    getTracks,
    {
      enabled: trackIds.length > 0,
    },
  );

  const {
    data: autosongs,
    isLoading: isLoadingAutocomplete,
    isFetching: isFetchingAutocomplete,
  } = useQuery(['search', debouncedQuery], search, {
    enabled: !!debouncedQuery,
  });

  const ids = useMemo(() => (data || []).map((t) => t.uri), [data]);

  usePlayPauseTrackHook(ids);

  // useIgnoreTrackHook();

  // useSaveTrackHook();

  return (
    <>
      <PageTitle>Recommendations</PageTitle>

      <EntityAutocomplete
        tracks={autosongs || []}
        isDisabled={trackIds.length > 5}
        isLoading={isFetchingAutocomplete}
        query={query}
        onQueryChange={setQuery}
        onTrackSelection={(b) => {
          const q = new URLSearchParams(searchParams);
          q.append('trackId', b.id);
          setSearchParams(q);
        }}
      />

      <Grid container spacing={1}>
        <Grid xs>
          {trackIds.length > 0 && (
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2" mb={1}>
                Selected tracks
              </Typography>
              <Stack direction="row" spacing={2}>
                {!songs &&
                  trackIds.length > 0 &&
                  trackIds.map((id) => <TrackChipSkeleton key={id} />)}
                {(songs || []).map((track) => (
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
              </Stack>
            </Box>
          )}
        </Grid>
        <Grid xs>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">Attributes</Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                mb: 3,
                mt: 1,
              }}
            >
              {attributes.map((attr) => (
                <RecommendationAttribute key={attr.name} attr={attr} />
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <div style={{ height: 800 }}>
        {trackIds.length > 0 && (
          <VirtualTable
            data={data || []}
            columns={columns}
            isLoading={isFetching}
            hasNextPage={false}
            fetchNextPage={null}
            isInitialLoading={true}
          />
        )}
      </div>
    </>
  );
}
