import { Navigate, useSearchParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { useQuery } from 'react-query';
import { useSnackbar } from 'notistack';
import { tokenState } from '../store';

export function Authorize() {
  const [searchParams] = useSearchParams();
  const setToken = useSetRecoilState(tokenState);
  const { enqueueSnackbar } = useSnackbar();

  const code = searchParams.get('code');

  const { isSuccess } = useQuery<void, Error, string>(
    ['authorize', code],
    async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/authorize?code=${code}`,
      );

      const body = await res.json();

      if (res.ok && body?.token) {
        return body.token;
      }

      throw new Error();
    },
    {
      enabled: !!code,
      suspense: true,
      useErrorBoundary: false,
      onSuccess(token) {
        setToken(token);
      },
      onError(e) {
        enqueueSnackbar('Authorization error', {
          variant: 'error',
        });

        console.log('Authorize error', e);
      },
    },
  );

  return <Navigate to={isSuccess ? '/dashboard' : '/login'} />;
}
