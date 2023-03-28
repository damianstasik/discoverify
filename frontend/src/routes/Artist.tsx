import {
  Link,
  Outlet,
  useLocation,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
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
import { BgImg } from '../components/BgImg';

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
      <BgImg
        src={data?.images?.[0].url}
        key={params.id}
        alt="Artist's picture"
      />
      <div className="relative">
        <div className="border-b border-white/5 backdrop-blur-lg">
          <h2 className="p-3 text-xl/none text-white font-bold">
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
      </div>

      <Suspense
        fallback={<div className="text-white text-lg p-3">Loading...</div>}
      >
        <Outlet />
      </Suspense>
    </>
  );
}
