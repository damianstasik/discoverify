import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import { useSnackbar } from 'notistack';
import Card from '@mui/material/Card';
import { useUpdateAtom } from 'jotai/utils';
import { tokenIdState } from '../store';

export function Authorize() {
  const query = new URLSearchParams(useLocation().search);
  const navigate = useNavigate();
  const setTokenId = useUpdateAtom(tokenIdState);

  // const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!query.has('code')) {
      console.error('Authorization code is missing', {
        variant: 'error',
      });
      navigate('/');
    } else {
      fetch(
        `${import.meta.env.VITE_API_URL}/authorize?code=${query.get('code')}`,
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            console.error(res.message, {
              variant: 'error',
            });
            navigate('/login');

            return;
          }

          setTokenId(res.tokenId);
          console.error('Logged in!', {
            variant: 'success',
          });
          navigate('/');
        })
        .catch((e) => console.error('e', e));
    }
  }, []);

  return (
    <div className="max-w-md mx-auto mt-24">
      <Card />
    </div>
  );
}
