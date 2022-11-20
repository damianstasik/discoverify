import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { type GridColumns, useGridApiRef } from '@mui/x-data-grid-premium';
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
import { Table } from '../components/Table';
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

function msToTime(duration: number) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);

  const m = minutes < 10 ? `0${minutes}` : minutes;
  const s = seconds < 10 ? `0${seconds}` : seconds;

  return `${m}:${s}`;
}

const columns: GridColumns = [
  {
    field: 'preview_url',
    headerName: '',
    width: 60,
    sortable: false,
    renderCell: (params) => <TrackPreviewColumn track={params.row} />,
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 0.2,
    sortable: false,
    renderCell: (params) => (
      <TrackNameColumn id={params.row.id} name={params.value} />
    ),
  },
  {
    field: 'artist',
    headerName: 'Artist(s)',
    flex: 0.2,
    sortable: false,
    renderCell: (params) => <ArtistColumn artists={params.value} />,
  },
  {
    field: 'album',
    headerName: 'Album',
    flex: 0.2,
    renderCell: (params) => (
      <AlbumColumn id={params.row.id} name={params.row.name} />
    ),
  },
  {
    field: 'duration',
    headerName: 'Duration',
    flex: 0.1,
    sortable: false,
    valueFormatter: (params: any) => {
      return msToTime(params.value);
    },
  },
  {
    field: 'actions',
    headerName: 'Actions',
    sortable: false,
    flex: 0.15,
    renderCell: (params) => <ActionsColumn track={params.row} />,
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
  );

  const {
    data: autosongs,
    isLoading: isLoadingAutocomplete,
    isFetching: isFetchingAutocomplete,
  } = useQuery(['search', token, debouncedQuery], search, {
    enabled: !!debouncedQuery,
  });

  const { mutate } = useMutation(ignoreTrack, {
    onSuccess(_, { id, isIgnored }) {
      queryClient.setQueryData<{ id: string }[]>(
        ['recommended', token, trackIds, values],
        produce((draft) => {
          if (!draft) return;
          const item = draft.find((t) => t.id === id);

          if (item) {
            item.isIgnored = !isIgnored;
          }
        }),
      );
    },
  });

  const deviceId = useRecoilValue(deviceIdAtom);

  const { mutate: play } = useMutation(async ({ ids, offset }) => {
    const qs = new URLSearchParams();
    qs.append('deviceId', deviceId);
    qs.append('offset', offset);
    for (let id of ids) {
      qs.append('id', id);
    }
    await fetch(`${import.meta.env.VITE_API_URL}/player/play?${qs}`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  const setPlayerState = useSetRecoilState(playerStateAtom);

  const apiRef = useGridApiRef();

  const ids = useMemo(() => (data || []).map((t) => t.uri), [data]);

  useEffect(() => {
    const handlePlayPauseTrack = (track) => {
      setPlayerState(PlaybackState.LOADING);
      play({
        ids,
        offset: track.uri,
      });
    };

    return apiRef.current.subscribeEvent(
      'playPauseTrack',
      handlePlayPauseTrack,
    );
  }, [apiRef, ids]);

  useEffect(() => {
    const handleIgnoreTrack = (params) => {
      mutate({
        id: params.id,
        isIgnored: params.isIgnored,
        token,
      });
    };

    return apiRef.current.subscribeEvent('ignoreTrack', handleIgnoreTrack);
  }, [apiRef, token]);

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
        <Table
          columns={columns}
          checkboxSelection
          onSelectionModelChange={(value) => setSelectedSongs(value)}
          selectionModel={selectedSongs}
          rows={data || []}
          loading={isFetching}
          apiRef={apiRef}
          getRowClassName={(row) => (row.row.isIgnored ? 'disabled' : '')}
        />
      </div>
    </>
  );
}
