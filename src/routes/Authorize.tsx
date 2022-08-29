import { Navigate, useSearchParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { type QueryFunction, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { tokenState } from '../store';

const authorizeQuery: QueryFunction<
  string,
  [key: string, code: string | null]
> = async ({ queryKey }) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/authorize?code=${queryKey[1]}`,
  );

  const body = await res.json();

  if (res.ok && body?.token) {
    return body.token;
  }

  throw new Error();
};

export function Authorize() {
  const [searchParams] = useSearchParams();
  const setToken = useSetRecoilState(tokenState);
  const { enqueueSnackbar } = useSnackbar();

  const code = searchParams.get('code');

  const { isSuccess } = useQuery(['authorize', code], authorizeQuery, {
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
