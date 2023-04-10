import { useEffect, useMemo, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { tokenState } from '../store';
import { trpc } from '../trpc';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useInfiniteLoading } from '../hooks/useInfiniteLoading';

function ArtistCardSkeleton() {
  return (
    <div className="relative flex-1 ">
      <div>
        <div className="h-40 rounded-t-md w-full object-cover object-center bg-slate-700" />
      </div>
      <div className="p-3 bg-slate-500 rounded-b-md flex group-hover:opacity-80">
        <div>
          <div className="animate-pulse leading-normal w-24 bg-slate-450 rounded-md before:content-['\00a0']" />
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
    <div className="relative flex-1 group">
      <div>
        <img
          src={artist.images.length > 1 ? artist.images[1].url : ''}
          alt={artist.name}
          loading="lazy"
          className="h-40 rounded-t-md w-full object-cover object-center"
        />
      </div>
      <RouterLink
        to={`/artist/${artist.id}`}
        className="p-3 bg-slate-500 rounded-b-md flex group-hover:opacity-80"
        preventScrollReset
      >
        <div className="leading-normal">{artist.name}</div>
        <span aria-hidden="true" className="absolute inset-0" />
      </RouterLink>
    </div>
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

  const flatWithSkel = useMemo(() => {
    if (hasNextPage) {
      const flats = Array.from(
        { length: 4 - (flatData.length % 4) },
        (_, i) => ({ id: `skeleton${i}`, name: 'skeleton' }),
      );

      return flatData.concat(flats);
    }

    return flatData;
  }, [flatData, hasNextPage]);

  const handleInfiniteLoadingScroll = useInfiniteLoading({
    fetchNextPage,
    isFetching: isLoading,
    hasNextPage,
  });

  const artists = chunk(flatWithSkel, 4);

  const virtualizer = useVirtualizer({
    count: artists.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => 300,
    overscan: 5,
  });

  return (
    <>
      <div variant="h5" gutterBottom>
        Artists from liked tracks
      </div>

      <div
        ref={parentRef}
        className="overflow-y-auto px-6"
        onScroll={handleInfiniteLoadingScroll}
      >
        <div
          className="relative overflow-hidden"
          style={{
            height: `${virtualizer.getTotalSize()}px`,
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.index}
              ref={virtualizer.measureElement}
              data-index={virtualItem.index}
              className="absolute flex gap-6 w-full top-0 left-0 py-3"
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
