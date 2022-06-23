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
import { useRecoilValue } from 'recoil';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import { useQuery } from 'react-query';
import styled from '@emotion/styled';
import { tokenState, userState } from '../store';
import { Navbar } from './Navbar';

const Heading = styled(Divider)`
  &::before {
    display: none;
  }
  &::after {
    top: 0;
  }
  .MuiDivider-wrapper {
    padding-left: 0;
    font-weight: 600;
    color: #fff;
  }
`;

function RouterListItem({ to, label, icon }: any) {
  const match = useMatch(to);

  return (
    <ListItem
      button
      component={RouterLink}
      to={to}
      selected={!!match}
      disableGutters
      sx={{
        width: 'auto',
        borderRadius: 1,

        '&.Mui-selected, &:hover, &.Mui-selected:hover': {
          background: 'none',
          color: '#fff',
        },
      }}
    >
      {icon && (
        <ListItemIcon sx={{ color: 'currentColor' }}>{icon}</ListItemIcon>
      )}
      <ListItemText primary={label} />
    </ListItem>
  );
}

const drawerWidth = 300;

export const Sidebar = memo(() => {
  const user = useRecoilValue(userState)!;
  const token = useRecoilValue(tokenState);

  const { data } = useQuery<
    void,
    Error,
    { playlists: any[]; hasNextPage: boolean }
  >(['playlists'], async function playlistsQuery() {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/user/playlists?limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const body = await res.json();

    return body;
  });

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        scrollbarColor: 'rgba(255,255,255,.3) transparent',
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
        },
      }}
      PaperProps={{
        sx: {
          background: '#000',
          border: 0,
          padding: '24px',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Navbar />

      <List dense disablePadding>
        <RouterListItem
          label="Dashboard"
          to="/dashboard"
          icon={<DashboardTwoTone />}
        />

        <RouterListItem
          label="Recommendations"
          to="/recommendations"
          icon={<RecommendIcon />}
        />
      </List>

      <Heading sx={{ mt: 3, mb: 2 }}>Artists</Heading>

      <List dense disablePadding>
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

      <Heading sx={{ mt: 3, mb: 2 }}>Tracks</Heading>

      <List dense disablePadding>
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

      <Heading sx={{ mt: 3, mb: 2 }}>Genres</Heading>

      <List dense disablePadding>
        <RouterListItem
          label="From followed artists"
          to="/followed-artists/genres"
          icon={<Icon path={mdiTagText} size={1} />}
        />
      </List>

      <Heading sx={{ mt: 3, mb: 2 }}>Playlists</Heading>

      <List dense disablePadding>
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

      <Divider sx={{ my: 3 }} />

      <List dense disablePadding sx={{ mt: 'auto' }}>
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
