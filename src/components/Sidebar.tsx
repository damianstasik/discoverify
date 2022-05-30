import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardTwoTone from '@mui/icons-material/DashboardTwoTone';
import { useMatch, Link as RouterLink } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import RecommendIcon from '@mui/icons-material/Recommend';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { memo } from 'react';
import {
  mdiAccountHeart,
  mdiAccountMultipleOutline,
  mdiTagText,
  mdiAccountMusic,
  mdiAccountMusicOutline,
  mdiAccountStar,
  mdiMusicNotePlus,
  mdiPlaylistMusic,
  mdiHistory,
} from '@mdi/js';
import Icon from '@mdi/react';
import { useAtomValue } from 'jotai';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import { useQuery } from 'react-query';
import { createTheme, ThemeProvider } from '@mui/material';
import { tokenIdState, userAtom } from '../store';
import { Navbar } from './Navbar';

function RouterListItem({ to, label, icon }: any) {
  const match = useMatch(to);

  return (
    <ListItem
      button
      component={RouterLink}
      to={to}
      selected={!!match}
      sx={{
        margin: 1,
        width: 'auto',
        borderRadius: 1,
        ':hover': {},

        '&.Mui-selected': {
          background: '#111827',
        },
      }}
    >
      {icon && <ListItemIcon sx={{ color: '#6B7280' }}>{icon}</ListItemIcon>}
      <ListItemText primary={label} />
    </ListItem>
  );
}

const drawerWidth = 300;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const Sidebar = memo(() => {
  const user = useAtomValue(userAtom)!;
  const tokenId = useAtomValue(tokenIdState);

  const { data } = useQuery<
    void,
    Error,
    { playlists: any[]; hasNextPage: boolean }
  >(['playlists'], async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/playlists?tokenId=${tokenId}&limit=5`,
    );
    const body = await res.json();

    return body;
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
        PaperProps={{
          sx: {
            backgroundColor: '#1f2937',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Navbar />

        <Divider />

        <List dense>
          <RouterListItem
            label="Dashboard"
            to="/"
            icon={<DashboardTwoTone />}
          />

          <RouterListItem
            label="Recommendations"
            to="/recommendations"
            icon={<RecommendIcon />}
          />
        </List>

        <Divider />

        <List
          dense
          subheader={
            <ListSubheader sx={{ background: 'none' }} component="div">
              Artists
            </ListSubheader>
          }
        >
          <RouterListItem
            label="My top artists"
            to="/top-artists"
            icon={<Icon path={mdiAccountStar} size={1} />}
          />

          <RouterListItem
            label="From liked tracks"
            to="/artists"
            icon={<Icon path={mdiAccountHeart} size={1} />}
          />

          <RouterListItem
            label="Related to followed"
            to="/similar"
            icon={<Icon path={mdiAccountMultipleOutline} size={1} />}
          />
        </List>

        <Divider />

        <List
          dense
          subheader={
            <ListSubheader sx={{ background: 'none' }} component="div">
              Tracks
            </ListSubheader>
          }
        >
          <RouterListItem
            label="Liked tracks"
            to="/liked"
            icon={<FavoriteIcon />}
          />

          <RouterListItem
            label="My top tracks"
            to="/top-tracks"
            icon={<Icon path={mdiMusicNotePlus} size={1} />}
          />

          <RouterListItem
            label="Top from followed artists"
            to="/followed-artists/top-tracks"
            icon={<Icon path={mdiAccountMusic} size={1} />}
          />

          <RouterListItem
            label="Top from related artists"
            to="/related-artists/top-tracks"
            icon={<Icon path={mdiAccountMusicOutline} size={1} />}
          />

          <RouterListItem
            label="Recently played"
            to="/recently-played"
            icon={<Icon path={mdiHistory} size={1} />}
          />
        </List>

        <Divider />

        <List
          dense
          subheader={
            <ListSubheader sx={{ background: 'none' }} component="div">
              Genres
            </ListSubheader>
          }
        >
          <RouterListItem
            label="From followed artists"
            to="/followed-artists/genres"
            icon={<Icon path={mdiTagText} size={1} />}
          />
        </List>

        <Divider />

        <List
          dense
          subheader={
            <ListSubheader sx={{ background: 'none' }} component="div">
              Playlists
            </ListSubheader>
          }
        >
          <Collapse in timeout="auto" unmountOnExit>
            <List component="div" disablePadding dense>
              {(data?.playlists || []).map((playlist) => (
                <RouterListItem
                  key={playlist.id}
                  label={playlist.name}
                  to={`/playlist/${playlist.id}`}
                />
              ))}

              <RouterListItem
                label="All playlists"
                to="/playlists"
                icon={<Icon path={mdiPlaylistMusic} size={1} />}
              />
            </List>
          </Collapse>
        </List>

        <Divider />

        <List dense sx={{ mt: 'auto' }}>
          <ListItem button>
            <ListItemAvatar>
              <Avatar src={user.photoUrl!} style={{ marginRight: '8px' }} />
            </ListItemAvatar>

            <ListItemText primary={user.displayName} secondary="My account" />
          </ListItem>
        </List>
      </Drawer>
    </ThemeProvider>
  );
});
