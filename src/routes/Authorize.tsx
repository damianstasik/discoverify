import { Navigate, useSearchParams } from 'react-router-dom';
import { useUpdateAtom } from 'jotai/utils';
import { useQuery } from 'react-query';
import { tokenIdState } from '../store';

export function Authorize() {
  const [searchParams] = useSearchParams();
  const setTokenId = useUpdateAtom(tokenIdState);

  const code = searchParams.get('code');

  const { isSuccess } = useQuery<void, Error, string>(
    ['authorize', code],
    async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/authorize?code=${code}`,
      );

      const body = await res.json();

      if (body?.tokenId) {
        return body.tokenId;
      }

      throw new Error();
    },
    {
      enabled: !!code,
      suspense: true,
      onSuccess(tokenId) {
        setTokenId(tokenId);
      },
      onError(e) {
        console.error('Authorize error', e);
      },
    },
  );

  return <Navigate to={isSuccess ? '/' : '/login'} />;
}
