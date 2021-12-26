import Card from '@mui/material/Card';
import { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';

export function Login() {
  const [isLoading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    fetch('${import.meta.env.VITE_API_URL}/login')
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        window.location.href = res.url;
      })
      .catch((e) => {
        console.log('login error', e);
        setLoading(false);
      });
  };
  return (
    <div className="max-w-md mx-auto mt-24">
      <Card>
        <LoadingButton
          variant="contained"
          onClick={handleClick}
          loading={isLoading}
        >
          Login with Spotify
        </LoadingButton>
      </Card>
    </div>
  );
}
