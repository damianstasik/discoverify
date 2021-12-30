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
} from '@mdi/js';
import Icon from '@mdi/react';
import { useAtomValue } from 'jotai/utils';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';
import { useQuery } from 'react-query';
import { tokenIdState, userAtom } from '../store';
import { Navbar } from './Navbar';

function RouterListItem({ to, label, icon }: any) {
  const match = useMatch(to);

  return (
    <ListItem button component={RouterLink} to={to} selected={!!match}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText primary={label} />
    </ListItem>
  );
}

const drawerWidth = 300;

export const Sidebar = memo(() => {
  const user = useAtomValue(userAtom)!;
  const tokenId = useAtomValue(tokenIdState);

  const { data } = useQuery(['playlists'], async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/playlists?tokenId=${tokenId}`,
    );
    const body = await res.json();

    return body.playlists;
  });

  return (
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
          backgroundColor: '#f3f4f6',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Navbar />

      <Divider />

      <List dense>
        <RouterListItem label="Dashboard" to="/" icon={<DashboardTwoTone />} />

        <RouterListItem
          label="Liked tracks"
          to="/liked"
          icon={<FavoriteIcon />}
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
          label="Top from followed artists"
          to="/followed-artists/top-tracks"
          icon={<Icon path={mdiAccountMusic} size={1} />}
        />

        <RouterListItem
          label="Top from related artists"
          to="/related-artists/top-tracks"
          icon={<Icon path={mdiAccountMusicOutline} size={1} />}
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
            {(data || []).map((playlist) => (
              <RouterListItem
                label={playlist.name}
                to={`/playlist/${playlist.id}`}
              />
            ))}
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
  );
});
