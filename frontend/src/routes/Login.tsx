import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { authUrlMutation } from '../api';
import { Button } from '../components/Button';

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
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-96 px-4 py-3 bg-neutral-800 rounded-lg">
        <h2 className="font-bold text-lg text-white">Login</h2>
        <p className="my-3 text-neutral-300 text-sm">
          You can login with Spotify by clicking the button below.
        </p>
        <Button onClick={handleClick} loading={isLoading}>
          Login with Spotify
        </Button>
      </div>
    </div>
  );
}
