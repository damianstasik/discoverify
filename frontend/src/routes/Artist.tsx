import {
  Link,
  Outlet,
  useLocation,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Suspense, useRef } from 'react';
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
        imgRef.current?.complete && 'opacity-20',
      )}
    >
      <span className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-slate-900" />
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
          : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-400',
        'group inline-flex items-center py-2 px-1 border-b-2 text-sm',
      )}
      aria-current={isCurrent ? 'page' : undefined}
    >
      <Icon
        path={tab.icon}
        className={twMerge(
          isCurrent
            ? 'text-green-500'
            : 'text-slate-450 group-hover:text-slate-400',
          'mr-2 s-4',
        )}
        aria-hidden="true"
      />
      <span>{tab.label}</span>
    </Link>
  );
}

export function Artist() {
  const params = useParams();
  const { state } = useLocation();

  const { data } = useQuery(
    ['artist', params.id],
    async function artistQuery({ queryKey, signal }) {
      const artist = await trpc.artist.byId.query(queryKey[1], {
        signal,
      });

      return artist;
    },
    { refetchOnMount: true, placeholderData: state },
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
      to: 'related-artists-top-tracks',
      label: "Related artists' top tracks",
      icon: mdiAccountMusic,
    },
  ];

  return (
    <>
      <Img src={data?.images?.[0].url} />
      <div className="relative">
        <div className="border-b border-white/20 backdrop-blur-lg">
          <h2 className="p-3 text-xl text-white font-bold leading-none">
            {data?.name || (
              <div className="animate-pulse h-em w-48 bg-slate-600 rounded-md" />
            )}
          </h2>

          <nav className="-mb-px flex gap-4 mx-3" aria-label="Tabs">
            {tabs.map((tab) => (
              <TabLink key={tab.label} tab={tab} />
            ))}
          </nav>
        </div>

        <Suspense
          fallback={<div className="text-white text-lg p-3">Loading...</div>}
        >
          <Outlet />
        </Suspense>
      </div>
    </>
  );
}
