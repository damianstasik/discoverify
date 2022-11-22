import { useEffect, useMemo } from 'react';
import {
  Link as RouterLink,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { useRecoilValue } from 'recoil';
import { IconButton, Link } from '@mui/material';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { mdiSpotify } from '@mdi/js';
import Icon from '@mdi/react';
import { tokenState } from '../store';
import * as trackApi from '../api/track';
import * as playlistApi from '../api/playlist';
import { VirtualTable } from '../components/VirtualTable';

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'owner',
    header: 'Owner',
    cell: (params) => (
      <Link component={RouterLink} to={`/artist/${params.row.original.id}`}>
        {params.getValue().display_name}
      </Link>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: (params) => (
      <IconButton
        size="small"
        aria-label="Open in Spotify"
        href={params.row.original.uri}
        target="_blank"
      >
        <Icon path={mdiSpotify} size={1} />
      </IconButton>
    ),
  },
];

export function Playlists() {
  const token = useRecoilValue(tokenState);
  const { id } = useParams<{ id: string }>();

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ['playlists', id],
    async function playlistsQuery({ pageParam = 0 }) {
      return playlistApi.getPlaylists(token, pageParam);
    },
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.hasNextPage ? pages.length : false,
    },
  );

  const rows = useMemo(
    () => (data?.pages || []).map((page) => page.playlists).flat(),
    [data],
  );

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Playlists
      </Typography>

      <div style={{ height: 800 }}>
        <VirtualTable
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          data={rows}
          columns={columns}
          isLoading={isFetching}
        />
      </div>
    </>
  );
}
