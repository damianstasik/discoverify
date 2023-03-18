import Button from '@mui/material/Button';
import {
  Link as RouterLink,
  Outlet,
  useLocation,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@mui/material';
import styled from '@emotion/styled';
import { Suspense, useEffect, useState } from 'react';
import { tokenState } from '../store';
import { PageTitle } from '../components/PageTitle';
import { trpc } from '../trpc';

const Bg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 500px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 0;
  opacity: 0;
  transition: opacity 0.3s;

  &.loaded {
    opacity: 0.25;
  }

  &:before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: linear-gradient(#0000 0%, #161616b5 50%, #161616 100%);
  }
`;

function Img({ src }) {
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    if (src) {
      const preloaderImg = document.createElement('img');
      preloaderImg.src = src;

      const handleLoad = () => {
        setLoaded(true);
      };

      preloaderImg.addEventListener('load', handleLoad);

      return () => {
        preloaderImg.removeEventListener('load', handleLoad);
      };
    }
  }, [src]);
  return (
    <Bg
      style={{ backgroundImage: isLoaded ? `url("${src}")` : '' }}
      className={isLoaded ? 'loaded' : ''}
    />
  );
}

function TabLink({ tab }) {
  const match = useResolvedPath(tab.to);
  const { pathname } = useLocation();

  return (
    <Button
      component={RouterLink}
      to={tab.to}
      variant={match.pathname === pathname ? 'outlined' : 'text'}
      sx={{
        padding: match.pathname === pathname ? '6px 9px' : '6px 10px',
        marginRight: '4px',
      }}
    >
      {tab.label}
    </Button>
  );
}

export function Artist() {
  const token = useRecoilValue(tokenState);
  const params = useParams();

  const { data } = useQuery(
    ['artist', params.id, token],
    async function artistQuery({ queryKey, signal }) {
      const artist = await trpc.artist.byId.query(queryKey[1], {
        signal,
      });

      return artist;
    },
    { refetchOnMount: true },
  );

  const tabs = [
    {
      to: '',
      label: 'Popular tracks',
    },
    {
      to: 'albums',
      label: 'Albums',
    },
    {
      to: 'singles',
      label: 'Singles and EPs',
    },
    {
      to: 'appears-on',
      label: 'Appears on',
    },
    {
      to: 'compilations',
      label: 'Compilations',
    },
  ];

  return (
    <>
      <Img src={data?.images?.[0].url} />

      <PageTitle>
        {data?.name || <Skeleton animation="wave" variant="text" width="20%" />}
      </PageTitle>

      <div>
        {tabs.map((tab) => (
          <TabLink key={tab.label} tab={tab} />
        ))}
      </div>

      <Suspense fallback={<div>loading</div>}>
        <Outlet />
      </Suspense>

      <Button
        component={RouterLink}
        to={`/related-artists/top-tracks/${data?.id}`}
      >
        Related artists' top tracks
      </Button>
    </>
  );
}
