import {
  Link,
  Outlet,
  useLocation,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Suspense, useEffect, useRef, useState } from 'react';
import { trpc } from '../trpc';
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
import { tw } from '../tw';

import {
  QuantizerCelebi,
  Scheme,
  Score,
  argbFromHex,
  argbFromRgb,
  hexFromArgb,
  rgbaFromArgb,
} from '@material/material-color-utilities';

async function extractColorFromImage(image: HTMLImageElement) {
  const imageBytes = await new Promise<Uint8ClampedArray>((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      reject(new Error('Could not get canvas context'));
      return;
    }
    const callback = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);

      const [sx, sy, sw, sh] = [0, 0, image.width, image.height];

      resolve(context.getImageData(sx, sy, sw, sh).data);
    };

    setTimeout(() => {
      callback();
    }, 500);
  });

  const pixels: number[] = [];
  for (let i = 0; i < imageBytes.length; i += 4) {
    const r = imageBytes[i];
    const g = imageBytes[i + 1];
    const b = imageBytes[i + 2];
    const a = imageBytes[i + 3];
    if (a < 255) {
      continue;
    }
    const argb = argbFromRgb(r, g, b);
    pixels.push(argb);
  }

  const result = QuantizerCelebi.quantize(pixels, 128);
  const ranked = Score.score(result);

  return Scheme.dark(ranked[0]);
}

function TabLink({ tab }) {
  const match = useResolvedPath(tab.to);
  const { pathname } = useLocation();
  const isCurrent = match.pathname === pathname;

  return (
    <Link
      to={tab.to}
      className={tw(
        isCurrent
          ? 'border-[--color] text-[--text-color]'
          : 'border-transparent text-white/60 hover:text-white/80 hover:border-white/80',
        'group inline-flex items-center py-2 px-1 border-b-2 text-sm transition-colors duration-300',
      )}
      aria-current={isCurrent ? 'page' : undefined}
    >
      <Icon
        path={tab.icon}
        className={tw(
          isCurrent
            ? 'text-[--text-color]'
            : 'text-white/40 group-hover:text-white/80',
          'mr-2 s-4 transition-colors duration-300',
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

  const ref = useRef<HTMLImageElement>(null);
  const [scheme, setScheme] = useState<Scheme>(
    Scheme.darkContent(argbFromHex('#000000')),
  );

  useEffect(() => {
    if (ref.current) {
      extractColorFromImage(ref.current).then((colors) => {
        setScheme(colors);
      });
    }
  }, [params.id]);

  const { r,g,b} = rgbaFromArgb(scheme.primaryContainer);

  return (
    <>
      <BgImg
        src={data?.images?.[0].url}
        key={params.id}
        alt="Artist's picture"
        ref={ref}
      />
      <div className="relative">
        <div
          className="border-b border-white/5 transition-colors duration-300 backdrop-blur bg-[--bg-color]"
          style={{
            '--bg-color': `rgba(${r}, ${g}, ${b}, 0.3)`,
          }}
        >
          <h2 className="p-3 text-xl/none text-white font-bold">
            {data?.name || (
              <div className="animate-pulse h-em w-48 bg-slate-600 rounded-md" />
            )}
          </h2>

          <nav
            className="-mb-px flex gap-4 mx-3   "
            aria-label="Tabs"
            style={{
              '--color': hexFromArgb(scheme.primaryContainer),
              '--text-color': hexFromArgb(scheme.primary),
            }}
          >
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
