import {
  Link,
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
import { trpc } from '../trpc';
import { twMerge } from 'tailwind-merge';
import { Icon } from '../components/Icon';
import {
  mdiAccountMusic,
  mdiFolderPlay,
  mdiMusicBox,
  mdiMusicBoxMultiple,
  mdiPlayBoxMultipleOutline,
  mdiTrendingUp,
} from '@mdi/js';

function Img({ src }) {
  const imgRef = useRef<HTMLImageElement>(null);

  return (
    <div
      className={twMerge(
        'absolute top-0 inset-x-0 z-0 h-[500px] opacity-0 transition-opacity duration-500',
        imgRef.current?.complete && 'opacity-25',
      )}
    >
      <span className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-neutral-900" />
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
  const isCurrent = match.pathname === pathname;

  return (
    <Link
      to={tab.to}
      className={twMerge(
        isCurrent
          ? 'border-green-500 text-green-600'
          : 'border-transparent text-neutral-400 hover:text-neutral-300 hover:border-neutral-500',
        'group inline-flex items-center py-2 px-1 border-b-2 text-sm',
      )}
      aria-current={isCurrent ? 'page' : undefined}
    >
      <Icon
        path={tab.icon}
        className={twMerge(
          isCurrent
            ? 'text-green-500'
            : 'text-neutral-500 group-hover:text-neutral-400',
          'mr-2 s-4',
        )}
        aria-hidden="true"
      />
      <span>{tab.label}</span>
    </Link>
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
      icon: mdiTrendingUp,
    },
    {
      to: 'albums',
      label: 'Albums',
      icon: mdiMusicBoxMultiple,
    },
    {
      to: 'singles',
      label: 'Singles and EPs',
      icon: mdiMusicBox,
    },
    {
      to: 'appears-on',
      label: 'Appears on',
      icon: mdiPlayBoxMultipleOutline,
    },
    {
      to: 'compilations',
      label: 'Compilations',
      icon: mdiFolderPlay,
    },
    {
      to: 'related-artists-tracks',
      label: "Related artists' top tracks",
      icon: mdiAccountMusic,
    },
  ];

  return (
    <>
      <Img src={data?.images?.[0].url} />

      <div className="p-3 relative">
        <h2 className="text-xl text-white font-bold">
          {data?.name || (
            <Skeleton animation="wave" variant="text" width="20%" />
          )}
        </h2>
      </div>

      <div className="border-b border-neutral-700 relative">
        <nav className="-mb-px flex gap-4 mx-3" aria-label="Tabs">
          {tabs.map((tab) => (
            <TabLink key={tab.label} tab={tab} />
          ))}
        </nav>
      </div>

      <Suspense fallback={<div>loading</div>}>{/* <Outlet /> */}</Suspense>
    </>
  );
}
