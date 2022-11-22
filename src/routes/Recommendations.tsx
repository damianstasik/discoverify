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
import { Stack } from '@mui/material';
import { EntityAutocomplete } from '../components/EntityAutocomplete';
import { TrackChipSkeleton } from '../components/TrackChipSkeleton';
import { PlaybackState } from '../types.d';
import { useAttributes } from '../hooks/useAttributes';
import { attributes as attributesConfig } from '../config/attributes';
import { usePlayPauseTrackHook } from '../hooks/usePlayPauseTrackHook';
import { useIgnoreTrackHook } from '../hooks/useIgnoreTrackHook';
import { useSaveTrackHook } from '../hooks/useSaveTrackHook';
import { VirtualTable } from '../components/VirtualTable';
import { ColumnDef } from '@tanstack/react-table';

function msToTime(duration: number) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);

  const m = minutes < 10 ? `0${minutes}` : minutes;
  const s = seconds < 10 ? `0${seconds}` : seconds;

  return `${m}:${s}`;
}

const columns: ColumnDef<any>[] = [
  {
    id: 'preview_url',
    header: '',
    size: 60,
    cell: (params) => <TrackPreviewColumn track={params.row.original} />,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (params) => (
      <TrackNameColumn id={params.row.original.id} name={params.getValue()} />
    ),
  },
  {
    accessorKey: 'artist',
    header: 'Artist(s)',
    cell: (params) => <ArtistColumn artists={params.getValue()} />,
  },
  {
    accessorKey: 'album',
    header: 'Album',
    cell: (params) => (
      <AlbumColumn
        id={params.row.original.id}
        name={params.row.original.name}
      />
    ),
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: (params) => {
      return msToTime(params.getValue());
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: (params) => <ActionsColumn track={params.row.original} />,
  },
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

  const { data, isFetching } = useQuery(
    ['recommended', token, trackIds, values],
    getRecommendedTracks,
    {
      enabled: trackIds.length > 0,
    },
  );

  const { data: songs, isLoading: isLoadingTracks } = useQuery(
    ['songs', token, trackIds],
    getTracks,
    {
      enabled: trackIds.length > 0,
    },
  );

  const {
    data: autosongs,
    isLoading: isLoadingAutocomplete,
    isFetching: isFetchingAutocomplete,
  } = useQuery(['search', token, debouncedQuery], search, {
    enabled: !!debouncedQuery,
  });

  const ids = useMemo(() => (data || []).map((t) => t.uri), [data]);

  usePlayPauseTrackHook(ids);

  useIgnoreTrackHook();

  useSaveTrackHook();

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

      <Box sx={{ my: 2 }}>
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

      {/* {attributes.map((attr) => (
        <RecommendationAttribute key={attr.name} attr={attr} />
      ))} */}

      <div style={{ height: 800 }}>
        <VirtualTable
          data={data || []}
          columns={columns}
          isLoading={isFetching}
          hasNextPage={false}
          fetchNextPage={null}
        />
      </div>
    </>
  );
}
