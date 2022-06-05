import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function Navbar() {
  return (
    <Box
      sx={{
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        pb: 3,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: '900', color: '#fff' }}>
        Discoverify
      </Typography>
    </Box>
  );
}
