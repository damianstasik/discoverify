import { memo, useEffect, useMemo, useState } from 'react';
import Typography from '@mui/material/Typography';
import { useRecoilValue } from 'recoil';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { mdiCardsHeartOutline, mdiSpotify } from '@mdi/js';
import Icon from '@mdi/react';
import { tokenState } from '../store';
import * as trackApi from '../api/track';
import { TrackSelectionToolbar } from '../components/TrackSelectionToolbar';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { ArtistColumn } from '../components/ArtistColumn';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { VirtualTable } from '../components/VirtualTable';
import { ColumnDef } from '@tanstack/react-table';

const OpenInSpotify = memo(({ row }) => {
  return (
    <IconButton
      size="small"
      aria-label="Open in Spotify"
      href={row.uri}
      target="_blank"
    >
      <Icon path={mdiSpotify} size={1} />
    </IconButton>
  );
});

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'uri',
    header: '',
    size: 50,
    cell: TrackPreviewColumn,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: TrackNameColumn,
  },
  {
    accessorKey: 'artists',
    header: 'Artist(s)',
    cell: (params) => <ArtistColumn artists={params.getValue()} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: (params) => (
      <>
        <OpenInSpotify row={params.row.original} />
      </>
    ),
  },
];

export function TopTracks() {
  const token = useRecoilValue(tokenState);
  const [timeRange, setTimeRange] = useState('short_term');

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ['top-tracks', timeRange],
    async function topTracksQuery({ pageParam = 0 }) {
      return trackApi.getTopTracks(token, timeRange, pageParam);
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    },
  );

  const rows = useMemo(
    () => (data?.pages || []).map((page) => page.tracks).flat(),
    [data],
  );

  return (
    <>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Top tracks
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Here are tracks based on calculated affinity.
      </Typography>

      <FormControl component="fieldset" disabled={isFetching} sx={{ mb: 2 }}>
        <FormLabel component="legend">Time range</FormLabel>
        <RadioGroup
          row
          name="timeRange"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <FormControlLabel
            value="short_term"
            control={<Radio />}
            label="Short term"
          />
          <FormControlLabel
            value="medium_term"
            control={<Radio />}
            label="Medium term"
          />
          <FormControlLabel
            value="long_term"
            control={<Radio />}
            label="Long term"
          />
        </RadioGroup>
      </FormControl>

      <div style={{ height: 750 }}>
        <VirtualTable
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          rows={rows}
          columns={columns}
          isLoading={isFetching}
        />
      </div>
    </>
  );
}
