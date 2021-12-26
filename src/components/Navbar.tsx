import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MusicNoteTwoToneIcon from '@mui/icons-material/MusicNoteTwoTone';
import { useAtomValue } from 'jotai/utils';
import { useState, memo } from 'react';
import { userSelector } from '../store';

export const Navbar = memo(() => {


  return (
    <Toolbar>
      <Typography
        variant="h6"
        noWrap
      >
        Discoverify.app
      </Typography>

    </Toolbar>
  );
});
