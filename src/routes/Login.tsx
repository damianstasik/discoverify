import { LoadingButton } from '@mui/lab';
import { type MutationFunction, useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { Card, Box, Typography } from '@mui/material';
import { trpc } from '../trpc';

const authUrlMutation: MutationFunction<string, void> = async () => {
  const url = await trpc.auth.url.mutate();

  return url;
};

export function Login() {
  const { enqueueSnackbar } = useSnackbar();

  const { mutate, isLoading } = useMutation(authUrlMutation, {
    onSuccess(url) {
      window.location.href = url;
    },
    onError(error) {
      console.log('Login error', error);

      enqueueSnackbar('Login error', {
        variant: 'error',
      });
    },
  });

  const handleClick = () => mutate();

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card sx={{ maxWidth: 300, p: 3 }}>
        <Typography variant="h5" sx={{ mb: 1.5, color: '#fff' }}>
          Login
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          You can login with Spotify by clicking the button below.
        </Typography>
        <LoadingButton
          variant="contained"
          onClick={handleClick}
          loading={isLoading}
        >
          Login with Spotify
        </LoadingButton>
      </Card>
    </Box>
  );
}
