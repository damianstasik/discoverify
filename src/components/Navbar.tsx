import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { memo } from 'react';

export const Navbar = memo(() => {
  return (
    <Toolbar>
      <Typography variant="h6" noWrap>
        Discoverify.app
      </Typography>
    </Toolbar>
  );
});
