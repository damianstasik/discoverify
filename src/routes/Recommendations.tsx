import { useState } from 'react';
import {
  Link,
  Link as RouterLink,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import Typography from '@mui/material/Typography';

import { GridCellParams, DataGridPro } from '@mui/x-data-grid-pro';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import LoadingButton from '@mui/lab/LoadingButton';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import PlayCircleFilledTwoToneIcon from '@mui/icons-material/PlayCircleFilledTwoTone';
import StopCircleTwoToneIcon from '@mui/icons-material/StopCircleTwoTone';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAtomValue } from 'jotai/utils';
import { useAtom } from 'jotai';
import Slider from '@mui/material/Slider';
import { useDebounce, useDebouncedCallback } from 'use-debounce';
import { RecommendationAttributes } from '../components/RecommendationAttributes';
import { tokenIdState, trackPreviewUrlSelector } from '../store';
import { Layout } from '../components/Layout';

function msToTime(duration: number) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);

  const m = minutes < 10 ? `0${minutes}` : minutes;
  const s = seconds < 10 ? `0${seconds}` : seconds;

  return `${m}:${s}`;
}

function PreviewColumn(params: GridCellParams) {
  const [trackPreviewUrl, setTrackPreviewUrl] = useAtom(
    trackPreviewUrlSelector,
  );

  return (
    <IconButton
      edge="end"
      aria-label="delete"
      onClick={() => setTrackPreviewUrl(params.value as string)}
    >
      {params.value === trackPreviewUrl ? (
        <StopCircleTwoToneIcon />
      ) : (
        <PlayCircleFilledTwoToneIcon />
      )}
    </IconButton>
  );
}

function LikeColumn(params: GridCellParams) {
  const tokenId = useAtomValue(tokenIdState);

  const { mutate, isSuccess, isLoading } = useMutation<void, Error, string>(
    async (id) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/save?trackId=${id}&tokenId=${tokenId}`,
        {
          method: 'put',
        },
      );
    },
  );

  return (
    <LoadingButton
      loading={isLoading}
      loadingPosition="start"
      style={{ color: 'red' }}
      color="inherit"
      startIcon={
        isSuccess || params.value ? (
          <FavoriteIcon />
        ) : (
          <FavoriteBorderOutlinedIcon />
        )
      }
      size="small"
      onClick={() => mutate(params.row.id as string)}
    >
      {params.value ? 'Saved' : 'Save'}
    </LoadingButton>
  );
}

function ArtistColumn(params: GridCellParams) {
  return (
    <Breadcrumbs>
      {(params.value as any[]).map((artist) => (
        <Link component={RouterLink} to={`/artist/${artist.id}`}>
          {artist.name}
        </Link>
      ))}
    </Breadcrumbs>
  );
}

function AlbumColumn(params: any) {
  return (
    <Link component={RouterLink} to={`/album/${params.value.id}`}>
      {params.value.name}
    </Link>
  );
}

export function Recommendations() {
  const tokenId = useAtomValue(tokenIdState);
  const location = useLocation();
  const q = new URLSearchParams(location.search);
  const trackIds = q.getAll('trackId');

  const minAcousticness = parseFloat(q.get('minAcousticness'));
  const maxAcousticness = parseFloat(q.get('maxAcousticness'));
  const targetAcousticness = parseFloat(q.get('targetAcousticness'));

  const { data, isFetching } = useQuery(
    ['recommended', trackIds, minAcousticness],
    async () => {
      const q = new URLSearchParams(location.search);

      if (minAcousticness) {
        q.append('minAcousticness', minAcousticness.toString());
      }

      if (maxAcousticness) {
        q.append('maxAcousticness', maxAcousticness.toString());
      }

      if (targetAcousticness) {
        q.append('targetAcousticness', targetAcousticness.toString());
      }

      q.append('tokenId', tokenId);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/recommended?${q}`,
      );
      const body = await res.json();

      return body.songs;
    },
  );

  const [selectedSongs, setSelectedSongs] = useState([]);

  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 500);

  const { data: songs, isLoading: isLoadingSongs } = useQuery<
    Array<{ id: string; title: string }>
  >(['songs', trackIds], async () => {
    const q = new URLSearchParams(location.search);

    q.append('tokenId', tokenId);
    const req = await fetch(`${import.meta.env.VITE_API_URL}/get-tracks?${q}`);
    const body = await req.json();

    return body.songs;
  });

  const { data: autosongs, isLoading: isLoadingAutocomplete } = useQuery<
    Array<{ id: string; title: string }>
  >(
    ['search', query],
    ['search', debouncedQuery],
    async () => {
      const q = new URLSearchParams();

      q.append('q', query);
      q.append('q', debouncedQuery);

      q.append('tokenId', tokenId);
      const req = await fetch(`${import.meta.env.VITE_API_URL}/search?${q}`);
      const body = await req.json();

      return body.songs;
    },
    {
      enabled: !!query,
      enabled: !!debouncedQuery,
    },
  );

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const generate = (attributes: any) => {
    const q = new URLSearchParams();

    trackIds.forEach((trackId) => q.append('trackId', trackId));

    if (attributes.shouldSetMinAcousticness) {
      q.append('minAcousticness', attributes.minAcousticness.toString());
    }

    if (attributes.shouldSetMaxAcousticness) {
      q.append('maxAcousticness', attributes.maxAcousticness.toString());
    }

    if (attributes.shouldSetTargetAcousticness) {
      q.append('targetAcousticness', attributes.targetAcousticness.toString());
    }

    navigate({
      pathname: '/recommendations',
      search: `?${q}`,
    });
  };

  return (
    <Layout>
      <Typography variant="h5" gutterBottom>
        Recommendations
      </Typography>

      <Autocomplete
        id="asynchronous-demo"
        autoHighlight
        style={{ width: 300 }}
        renderOption={(option: any, a: any) => {
          return (
            <MenuItem
              {...option}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              <Typography display="block">{a.title}</Typography>
              <Typography variant="caption" display="block">
                {a.artist.map((ar) => ar.name).join(' / ')}
              </Typography>
            </MenuItem>
          );
        }}
        getOptionLabel={(option) => option.title}
        options={autosongs || []}
        disabled={(songs || []).length === 5}
        loading={isLoadingAutocomplete}
        onInputChange={(event, newInputValue) => {
          setQuery(newInputValue);
        }}
        onChange={(a, b) => {
          queryClient.setQueryData(
            ['songs', `${trackIds},${b.id}`],
            songs.concat(b),
          );
          const q = new URLSearchParams(location.search);
          q.append('trackId', b.id);
          navigate({
            pathname: '/recommendations',
            search: `?${q}`,
          });
        }}
        inputValue={query}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Asynchronous"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoadingAutocomplete ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      <>
        {(songs || []).map((song) => (
          <Chip
            label={`${song.title}`}
            key={song.id}
            onDelete={() => {
              const q = new URLSearchParams();
              trackIds.forEach((trackId) => {
                if (trackId !== song.id) {
                  q.append('trackId', trackId);
                }
              });
              navigate({
                pathname: '/recommendations',
                search: `?${q}`,
              });
            }}
          />
        ))}
      </>

      <Divider />

      <Slider
        defaultValue={[20, 37, 50]}
        disableSwap
        valueLabelDisplay="on"
        valueLabelFormat={(_, index) =>
          index === 0 ? 'Min' : index === 2 ? 'Max' : 'Target'
        }
      />

      <RecommendationAttributes
        attributes={{
          minAcousticness,
          maxAcousticness,
          targetAcousticness,
        }}
        onGenerate={(attributes) => generate(attributes)}
      />

      <p>Presets: przycisk przycisk</p>
      <div style={{ height: 800 }}>
        <DataGridPro
          columns={[
            {
              field: 'preview_url',
              headerName: 'Preview',
              flex: 0.1,
              renderCell: PreviewColumn,
            },
            {
              field: 'isSaved',
              headerName: 'Like',
              flex: 0.1,
              renderCell: LikeColumn,
            },
            { field: 'title', headerName: 'Title', flex: 0.2 },
            {
              field: 'artist',
              headerName: 'Artist',
              flex: 0.2,
              renderCell: ArtistColumn,
            },
            {
              field: 'album',
              headerName: 'Album',
              flex: 0.2,
              renderCell: AlbumColumn,
            },
            {
              field: 'duration',
              headerName: 'Duration',
              flex: 0.1,
              valueFormatter: (params: any) => {
                return msToTime(params.value);
              },
            },
          ]}
          disableColumnResize
          disableColumnMenu
          disableColumnReorder
          disableColumnSelector
          disableDensitySelector
          disableExtendRowFullWidth
          disableMultipleColumnsSorting
          disableSelectionOnClick
          hideFooter
          hideFooterRowCount
          hideFooterSelectedRowCount
          checkboxSelection
          onSelectionModelChange={(newSelection) =>
            setSelectedSongs(newSelection)
          }
          selectionModel={selectedSongs}
          isRowSelectable={(params: any) =>
            selectedSongs.includes(params.row.id)
              ? true
              : selectedSongs.length < 5
          }
          rows={data || []}
          loading={isFetching}
          hideFooterPagination
        />
      </div>
    </Layout>
  );
}
