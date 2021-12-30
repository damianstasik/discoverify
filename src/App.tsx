import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LicenseInfo } from '@mui/x-data-grid-pro';
import { useAtomValue } from 'jotai/utils';
import { useAtom } from 'jotai';
import { Router } from './Router';
import { tokenIdState, userAtom } from './store';

const muiLicenseKey = import.meta.env.VITE_MUI_LICENSE_KEY;

if (muiLicenseKey) {
  LicenseInfo.setLicenseKey(muiLicenseKey);
}

export function App() {
  const user = useAtomValue(userAtom);
  const location = useLocation();
  const navigate = useNavigate();
  const [tokenId, setTokenId] = useAtom(tokenIdState);

  useEffect(() => {
    if (
      !tokenId &&
      location.pathname !== '/login' &&
      location.pathname !== '/authorize'
    ) {
      navigate('/login');
    } else if (tokenId && !user) {
      setTokenId('');
    } else if (
      user &&
      (location.pathname === '/login' || location.pathname === '/authorize')
    ) {
      navigate('/');
    }
  }, [location, tokenId, user]);

  return <Router />;
}
