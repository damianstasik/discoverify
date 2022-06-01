import type { ReactNode } from 'react';

import 'react-h5-audio-player/lib/styles.css';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Player } from './Player';

const drawerWidth = 300;

export function Layout() {

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f3f4f6' }}>
      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>

      <AppBar
        position="fixed"
        style={{
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: `${drawerWidth}px`,
          top: 'auto',
          bottom: 0,
        }}
      >
        <Player />
      </AppBar>
    </div>
  );
}
