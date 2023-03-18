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
import { Suspense, useRef } from 'react';
import { tokenState } from '../store';
import { PageTitle } from '../components/PageTitle';
import { trpc } from '../trpc';
import { twMerge } from 'tailwind-merge';

function Img({ src }) {
  const imgRef = useRef<HTMLImageElement>(null);

  return (
    <div
      className={twMerge(
        'absolute top-0 inset-x-0 z-0 h-[500px] opacity-0 transition-opacity duration-500',
        imgRef.current?.complete && 'opacity-25',
      )}
    >
      <span className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900" />
      <img
        src={src}
        alt="Artist's picture"
        className="object-cover w-full h-full"
        ref={imgRef}
      />
    </div>
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
