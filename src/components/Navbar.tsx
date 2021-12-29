import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { memo } from 'react';

export const Navbar = memo(() => {
  return (
    <Toolbar
      sx={{
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        py: 1,
        '&': {
          px: 2,
        },
      }}
    >
      <Typography variant="h6" display="block">
        Discoverify.app
      </Typography>
      <Typography variant="caption">Made with ❤️ by @ds</Typography>
    </Toolbar>
  );
});
