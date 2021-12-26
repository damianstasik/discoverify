import * as React from 'react';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useSearchParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import PersonAddTwoToneIcon from '@mui/icons-material/PersonAddTwoTone';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import PlayCircleFilledTwoToneIcon from '@mui/icons-material/PlayCircleFilledTwoTone';
import StopCircleTwoToneIcon from '@mui/icons-material/StopCircleTwoTone';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import Drawer from '@mui/material/Drawer';
import CardActionArea from '@mui/material/CardActionArea';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  DataGridPro,
  GridActionsCellItem,
  GridActionsCellItemProps,
  GridColumns,
  useGridApiContext,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { useAtomValue } from 'jotai/utils';
import { useAtom } from 'jotai';
import { Breadcrumbs, Link, Tooltip } from '@mui/material';
import { useMutation, useQuery } from 'react-query';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { tokenIdState, trackPreviewState } from '../store';
import { Layout } from '../components/Layout';
import {
  mdiAccountHeart,
  mdiAccountMultipleOutline,
  mdiTagText,
  mdiTagTextOutline,
  mdiAccountMusic,
  mdiAccountMusicOutline,
  mdiCardsHeartOutline
} from '@mdi/js';
import Icon, { Stack } from '@mdi/react';

function ArtistCardSkeleton() {
  return (
    <Card>
      <Skeleton variant="rectangular" height={300} animation="wave" />
      <CardContent>
        <Typography variant="h6">
          <Skeleton animation="wave" />
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Skeleton variant="rectangular" animation="wave">
          <LoadingButton startIcon={<PersonAddTwoToneIcon />}>
            Follow
          </LoadingButton>
        </Skeleton>
      </CardActions>
    </Card>
  );
}



const columns: GridColumns = [
  {
    type: 'actions',
    field: 'actionss',
    headerName: '',
    width: 50,
    getActions: (params) => {
      const apiRef = useGridApiContext();

      return [
      <GridActionsCellItem
        icon={<PlayCircleIcon />}
        onClick={() => apiRef.current.publishEvent('playTrackPreview', {
          url: params.row.preview_url,
          track: params.row,
        })}
        label="Play"
      />,
    ];
    }
  },
  { field: 'name', headerName: 'Name', width: 300 },
  {
    field: 'artists',
    headerName: 'Artists',
    width: 500,
    renderCell: (params) => (
      <Breadcrumbs>
        {(params.value as any[]).map((artist) => (
          <Link component={RouterLink} to={`/artist/${artist.id}`}>
            {artist.name}
          </Link>
        ))}
      </Breadcrumbs>
    ),
  },

  {
    type: 'actions',
    field: 'actions',
    headerName: 'Actions',

    getActions: (params) => {
      const apiRef = useGridApiContext();


      
      return [
      <GridActionsCellItem
        icon={<VisibilityOffIcon />}
        onClick={() => {}}
        label="Hide"
      />,

      <GridActionsCellItem
        icon={<Icon path={mdiCardsHeartOutline} size={1} />}
        onClick={() => apiRef.current.publishEvent('saveTrack', params.row)}
        label="Save"
      />


    ];
  }
  },
];

export function FollowedArtistsTopTracks() {
  const tokenId = useAtomValue(tokenIdState);
  const [trackPreview, setTrackPreview] = useAtom(trackPreviewState);


  const [searchParams, setSearchParams] = useSearchParams();
  const apiRef = useGridApiRef();
  const genre = searchParams.get('genre');

  const { mutateAsync: saveTrack } = useMutation<void, Error, string>(async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/save?tokenId=${tokenId}&trackId=${id}`, {
      method: 'put',
    });
  });

  const { data: tracks, isLoading } = useQuery(['top-tracks', genre], async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/followed-artists/top-tracks?tokenId=${tokenId}&genre=${searchParams.get(
        'genre',
      )}`,
    );

    const body = await res.json();

    return body;
  })


  React.useEffect(() => {

    if (!apiRef.current || isLoading) return;

    apiRef.current.subscribeEvent('playTrackPreview', (params) => {
      setTrackPreview({
        url: params.url,
        context: params.track
      })
    });

    apiRef.current.subscribeEvent('saveTrack', (params) => {
saveTrack(params.id)
    });
  }, [apiRef, isLoading]);



  return (
    <Layout>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Top songs from followed artists
      </Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
        Here are tracks that come from top 10 lists of the artists that you follow.
        The list does not include tracks that you have already saved in your library.
      </Typography>

      <div style={{ height: 800, width: '100%' }}>
          <DataGridPro
            disableSelectionOnClick
            apiRef={apiRef}
            rows={tracks}
            columns={columns}
            loading={isLoading}
   
          />
        </div>


 
    </Layout>
  );
}
