import { Navigate, useSearchParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { type QueryFunction, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { tokenState } from '../store';
import { trpc } from '../trpc';

const authorizeQuery: QueryFunction<string, [key: string, code: string]> =
  async ({ queryKey, signal }) => {
    const token = await trpc.auth.authorize.query(queryKey[1], { signal });

    return token;
  };

export function Authorize() {
  const [searchParams] = useSearchParams();
  const setToken = useSetRecoilState(tokenState);
  const { enqueueSnackbar } = useSnackbar();

  const code = searchParams.get('code');

  const { isSuccess } = useQuery(['authorize', code!], authorizeQuery, {
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
  });

  return <Navigate to={isSuccess ? '/recommendations' : '/login'} />;
}
