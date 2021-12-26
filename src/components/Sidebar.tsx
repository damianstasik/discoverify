import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import Toolbar from '@mui/material/Toolbar';
import DashboardTwoTone from '@mui/icons-material/DashboardTwoTone';
import ThumbUpAltTwoTone from '@mui/icons-material/ThumbUpAltTwoTone';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import TrendingUpTwoToneIcon from '@mui/icons-material/TrendingUpTwoTone';
import { useMatch, Link as RouterLink } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import RecommendIcon from '@mui/icons-material/Recommend';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { memo, useState } from 'react';
import styled from '@emotion/styled';
import GroupIcon from '@mui/icons-material/Group';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import {
  mdiAccountHeart,
  mdiAccountMultipleOutline,
  mdiTagText,
  mdiTagTextOutline,
  mdiAccountMusic,
  mdiAccountMusicOutline,
} from '@mdi/js';
import Icon, { Stack } from '@mdi/react';
import { Navbar } from './Navbar';
import { useAtomValue } from 'jotai/utils';
import { userSelector } from '../store';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

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

  const user = useAtomValue(userSelector)!;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
          backgroundColor: '#f3f4f6'
        }
      }}
      variant="permanent"
      anchor="left"
    >

        <Navbar />

      <Divider />
      <List dense>
        <RouterListItem label="Dashboard" to="/" icon={<DashboardTwoTone />} />
        <RouterListItem
          label="Liked songs"
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
        subheader={<ListSubheader sx={{ background: 'none'}} component="div">Artists</ListSubheader>}
      >
        <RouterListItem
          label="From liked songs"
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
        subheader={<ListSubheader sx={{ background: 'none'}} component="div">Songs</ListSubheader>}
      >
        <RouterListItem
          label="Top from followed artists"
          to="/followed-artists/top-tracks"
          icon={<Icon path={mdiAccountMusic} size={1} />}
        />
        <RouterListItem
          label="Top from related artists"
          to="/similar"
          icon={<Icon path={mdiAccountMusicOutline} size={1} />}
        />
      </List>
      <Divider />
      <List
        dense
        subheader={<ListSubheader sx={{ background: 'none'}} component="div">Genres</ListSubheader>}
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
sx={{mt:'auto'}}
      >
        
      <ListItem button       >
      <ListItemAvatar>
      <Avatar src={user.photoUrl!} style={{ marginRight: '8px' }} />
        </ListItemAvatar>

      <ListItemText primary={user.displayName} secondary={'My account'} />
    </ListItem>

    </List>
 
    </Drawer>
  );
});
