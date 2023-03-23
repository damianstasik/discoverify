import { Navigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { trpc } from '../trpc';

const authorizeQuery: Query<'auth.authorize', [key: string, code: string]> =
  async ({ queryKey, signal }) => {
    await trpc.auth.authorize.query(queryKey[1], { signal });
    return queryKey[1];
  };

export function Authorize() {
  const [searchParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();

  const code = searchParams.get('code');

  const { isSuccess } = useQuery(['authorize', code!], authorizeQuery, {
    enabled: !!code,
    suspense: true,
    useErrorBoundary: false,
    onError(e) {
      enqueueSnackbar('Authorization error', {
        variant: 'error',
      });
    },
  });

  return <Navigate to={isSuccess ? '/recommendations' : '/login'} />;
}
