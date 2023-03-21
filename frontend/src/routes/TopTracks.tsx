import { memo, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useInfiniteQuery } from '@tanstack/react-query';
import { mdiSpotify } from '@mdi/js';
import { tokenState } from '../store';
import * as trackApi from '../api/track';
import { TrackPreviewColumn } from '../components/TrackPreviewColumn';
import { ArtistColumn } from '../components/ArtistColumn';
import { TrackNameColumn } from '../components/TrackNameColumn';
import { VirtualTable } from '../components/VirtualTable';
import { ColumnDef } from '@tanstack/react-table';
import { IconButton } from '../components/IconButton';

const OpenInSpotify = memo(({ row }) => {
  return (
    <IconButton
      label="Open in Spotify"
      href={row.uri}
      target="_blank"
      icon={mdiSpotify}
    />
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
    cell: ArtistColumn,
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
      <div variant="h5" sx={{ mb: 1 }}>
        Top tracks
      </div>

      <div variant="subtitle1" sx={{ mb: 2 }}>
        Here are tracks based on calculated affinity.
      </div>

      {/* <FormControl component="fieldset" disabled={isFetching} sx={{ mb: 2 }}>
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
      </FormControl> */}

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
