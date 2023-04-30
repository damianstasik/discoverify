import { useEffect, useMemo, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { tokenState } from '../store';
import { trpc } from '../trpc';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useInfiniteLoading } from '../hooks/useInfiniteLoading';
import { useTailwindBreakpointValue } from '../tw';

function ArtistCardSkeleton() {
  return (
    <div className='relative flex-1 '>
      <div className='h-64 rounded-t-md rounded-b-xl w-full bg-slate-700 animate-pulse' />

      <div className=' p-3 bg-slate-500 rounded-b-md flex group-hover:opacity-80 absolute bottom-0 inset-x-0'>
        <div>
          <div className="animate-pulse leading-normal w-24 bg-slate-475 rounded-md before:content-['\00a0']" />
        </div>
      </div>
    </div>
  );
}

function ArtistCard({ artist }: { artist: any }) {
  const [isLoading, setLoading] = useState(false);
  const [isFollowing, setFollowingState] = useState(false);
  const token = useRecoilValue(tokenState);
  const handleFollow = () => {
    setLoading(true);

    fetch(
      `${import.meta.env.VITE_API_URL}/follow?tokenId=${token}&artistId=${
        artist.id
      }`,
      { method: 'put' },
    )
      .then((res) => res.json())
      .then(() => {
        setLoading(false);
        setFollowingState(true);
      });
  };
  return (
    <RouterLink
      className='relative flex-1 hover:opacity-80  '
      to={`/artist/${artist.id}`}
    >
      <img
        src={artist.images.length > 1 ? artist.images[1].url : ''}
        alt={artist.name}
        loading='lazy'
        className='h-64 w-full object-cover object-center rounded-t-md rounded-b-xl'
      />

      <p className='p-3 bg-slate-500 rounded-b-md flex  absolute bottom-0 inset-x-0'>
        <h6 className='leading-normal'>{artist.name}</h6>
        <span aria-hidden='true' className='absolute inset-0' />
      </p>
    </RouterLink>
  );
}

const getArtistsFromSavedTracks: Query<'artist.getArtistsFromSavedTracks'> =
  async ({ pageParam = 0, signal }) => {
    return trpc.artist.getArtistsFromSavedTracks.query(
      { offset: pageParam },
      { signal },
    );
  };

export function ArtistsFromSavedTracks() {
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery(['artistsFromSavedTracks'], getArtistsFromSavedTracks, {
      getNextPageParam: (lastPage) => lastPage.nextOffset,
    });

  const parentRef = useRef<HTMLDivElement>(null);

  const flatData = useMemo(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data],
  );

  const colNum = useTailwindBreakpointValue({
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
    '2xl': 5,
  });

  const flatWithSkel = useMemo(() => {
    if (!flatData.length && isLoading) {
      return Array.from({ length: colNum * 3 }, (_, i) => ({
        id: `skeleton${i}`,
        name: 'skeleton',
      }));
    }

    if (hasNextPage) {
      const flats = Array.from(
        { length: colNum - (flatData.length % colNum) },
        (_, i) => ({ id: `skeleton${i}`, name: 'skeleton' }),
      );

      return flatData.concat(flats);
    }

    return flatData;
  }, [flatData, hasNextPage, isLoading, colNum]);

  const handleInfiniteLoadingScroll = useInfiniteLoading({
    fetchNextPage,
    isFetching: isLoading,
    hasNextPage,
  });

  const artists = chunk(flatWithSkel, colNum);

  const virtualizer = useVirtualizer({
    count: artists.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => 256,
    overscan: 5,
  });

  return (
    <>
      <div className='p-3'>
        <h2 className='mb-2 text-xl/none text-white font-bold'>
          Artists from liked songs
        </h2>
        <p className='text-gray-400 text-sm'>
          Here are artists that you are not following based on songs that you
          liked. You can follow them or hide them from this list.
        </p>
      </div>

      <div
        ref={parentRef}
        className='overflow-y-auto px-3'
        onScroll={handleInfiniteLoadingScroll}
      >
        <div
          className='relative overflow-hidden'
          style={{
            height: `${virtualizer.getTotalSize()}px`,
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.index}
              ref={virtualizer.measureElement}
              data-index={virtualItem.index}
              className='absolute flex gap-3 w-full top-0 left-0 pb-3'
              style={{
                transform: `translate3d(0, ${virtualItem.start}px, 0)`,
              }}
            >
              {artists[virtualItem.index].map((artist) =>
                artist.name === 'skeleton' ? (
                  <ArtistCardSkeleton key={artist.id} />
                ) : (
                  <ArtistCard key={artist.id} artist={artist} />
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function chunk(array: any[], n: number) {
  return array.reduce((acc, val, i) => {
    const idx = Math.floor(i / n);
    const chunk = acc[idx] || (acc[idx] = []);
    chunk.push(val);
    return acc;
  }, []);
}
