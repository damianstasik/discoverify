import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { GridColumns, DataGridPro } from '@mui/x-data-grid-pro';
import { useAtomValue } from 'jotai/utils';
import { useQuery } from 'react-query';
import { tokenIdState } from '../store';
import { Layout } from '../components/Layout';

const columns: GridColumns = [
  { field: 'name', headerName: 'Name', width: 300, sortable: false },
  { field: 'count', headerName: 'Count', width: 100, sortable: false },
  {
    field: 'cos',
    headerName: 'Top tracks from genre',
    width: 300,
    sortable: false,
    renderCell: (params) => (
      <Button
        component={RouterLink}
        to={`/followed-artists/top-tracks?genre=${encodeURIComponent(
          params.row.name,
        )}`}
      >
        Top tracks
      </Button>
    ),
  },
];

async function fetchFollowedArtistsGenres(tokenId) {
  const res = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/followed-artists/genres?tokenId=${tokenId}`,
  );

  const body = await res.json();

  return body;
}

export function FollowedArtistsGenres() {
  const tokenId = useAtomValue(tokenIdState);

  const { isLoading, data } = useQuery(
    ['followed-artists-genres', tokenId],
    () => fetchFollowedArtistsGenres(tokenId),
  );

  return (
    <Layout>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Genres from followed artists
      </Typography>

      <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
        Here are genres
      </Typography>

      <div style={{ height: 800 }}>
        <DataGridPro
          loading={isLoading}
          rows={data}
          columns={columns}
          getRowId={(a) => a.name}
          disableSelectionOnClick
          disableColumnResize
          disableColumnMenu
          disableColumnReorder
          disableColumnSelector
          disableDensitySelector
          disableMultipleColumnsSorting
          disableColumnFilter
          disableMultipleColumnsFiltering
          hideFooter
        />
      </div>
    </Layout>
  );
}
