import type { ReactNode } from 'react';

import 'react-h5-audio-player/lib/styles.css';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import { Sidebar } from './Sidebar';
import { Player } from './Player';

const drawerWidth = 300;

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        {children}
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
