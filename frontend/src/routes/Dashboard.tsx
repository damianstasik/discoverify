import { useRecoilState, useRecoilValue } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { mdiPauseCircle, mdiPlayCircle } from '@mdi/js';
import { loadingTrackPreview, trackPreviewState } from '../store';
import { trpc } from '../trpc';
import { twMerge } from 'tailwind-merge';
import { Button } from '../components/Button';
import { IconButton } from '../components/IconButton';

function CardWithLink({ title, children, linkTo, isLoading, linkLabel }) {
  return (
    <Card>
      <h5 className="text-base font-semibold text-white">{title}</h5>

      {children}

      <Button
        component={Link}
        variant="outlined"
        to={linkTo}
        disabled={isLoading}
        className="mt-2"
      >
        {linkLabel}
      </Button>
    </Card>
  );
}

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function Track({ track }) {
  const [trackPreview, setTrackPreview] = useRecoilState(trackPreviewState);

  const isLoadingTrackPreview = useRecoilValue(loadingTrackPreview);

  const isCurrentlyPlaying = (t) =>
    trackPreview?.url === t.preview_url && trackPreview?.context === t;

  const playPreview = (t) =>
    setTrackPreview({
      url: t.preview_url,
      context: t,
      state: 'playing',
    });

  return (
    <div className="flex gap-2 items-center">
      <div>
        <IconButton
          label="Play"
          disabled={isLoadingTrackPreview}
          onClick={() => playPreview(track)}
          icon={isCurrentlyPlaying(track) ? mdiPauseCircle : mdiPlayCircle}
          className='text-white'
        />
      </div>
      <div className="flex gap-1 w-full flex-col">
        <Link
          to={`/track/${track.id}`}
          className="underline decoration-green-900 underline-offset-4 hover:decoration-green-500"
        >
          {track.name}
        </Link>
        <div>
          {track.artists.map((artist) => (
            <Link
              to={`/artist/${artist.id}`}
              key={artist.id}
              className="underline decoration-yellow-900 underline-offset-4 hover:decoration-yellow-500"
            >
              {artist.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArtistSkeleton() {
  const width = getRandomArbitrary(10, 40);

  return (
    <div className="flex gap-2 items-center">
      <div className="animate-pulse w-10 h-10 bg-slate-500 rounded-md" />
      <div
        className="animate-pulse bg-slate-500 rounded-md skeleton"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function TrackSkeleton() {
  const width1 = getRandomArbitrary(20, 60);
  const width2 = getRandomArbitrary(20, 60);

  return (
    <div className="flex gap-2 items-center">
      <div>
        <div className="animate-pulse s-8 bg-slate-500 rounded-md" />
      </div>
      <div className="flex gap-1 w-full flex-col">
        <div
          className="animate-pulse  bg-slate-500 rounded-md skeleton"
          style={{ width: `${width1}%` }}
        />
        <div
          className="animate-pulse  bg-slate-500 rounded-md skeleton"
          style={{ width: `${width2}%` }}
        />
      </div>
    </div>
  );
}

function findImageUrlByMinWidth(images: any[], width: number) {
  const image = images
    .slice()
    .reverse()
    .find((img) => img.width >= width);

  if (image?.url) {
    return image.url;
  }

  return images[0].url;
}

function Card({ children, className }) {
  return (
    <div className={twMerge('px-3 py-2 bg-slate-700 rounded-md', className)}>
      {children}
    </div>
  );
}

const statsQuery: Query<'user.stats', [key: string]> = async ({ signal }) => {
  const stats = await trpc.user.stats.query(undefined, {
    signal,
  });

  return stats;
};

export default function Dashboard() {
  const { data, isLoading } = useQuery(['stats'], statsQuery);

  return (
    <div className="p-3 grid gap-4 grid-cols-3">
      <Card>
        <h5 className="text-base font-semibold text-white mb-2">
          Liked tracks
        </h5>
        <h6 className="text-lg/none text-white oldstyle-nums">
          {isLoading ? (
            <div className="animate-pulse h-em w-16 bg-slate-500 rounded-md" />
          ) : (
            data?.likedTracksSpotify ?? 'N/A'
          )}
        </h6>
        <p className="text-slate-300 text-base">on Spotify</p>

        <Button
          variant="outlined"
          component={Link}
          to="/liked"
          disabled={isLoading}
          className="mt-2"
        >
          All liked tracks
        </Button>
      </Card>

      <Card>
        <h5 className="text-base font-semibold text-white mb-2">
          Followed artists
        </h5>
        <h6 className="text-lg/none text-white oldstyle-nums">
          {isLoading ? (
            <div className="animate-pulse h-em w-16 bg-slate-500 rounded-md" />
          ) : (
            data?.followedArtistsSpotify ?? 'N/A'
          )}
        </h6>
        <p className="text-slate-300 text-base">on Spotify</p>

        <Button
          variant="outlined"
          component={Link}
          to="/artists"
          disabled={isLoading}
          className="mt-2"
        >
          All followed artists
        </Button>
      </Card>

      <Card>
        <h5 className="text-base font-semibold text-white mb-2">
          Recently played track
        </h5>
        <div className="">
          {isLoading && <TrackSkeleton />}
          {!isLoading && <Track track={data?.recentlyPlayedTrack?.track} />}
        </div>

        <Button
          variant="outlined"
          component={Link}
          to="/recently-played"
          disabled={isLoading}
          className="mt-2"
        >
          More recently played tracks
        </Button>
      </Card>

      <CardWithLink
        title="Top 5 artists"
        linkTo="/top-artists"
        linkLabel="All top artists"
        isLoading={isLoading}
      >
        <h5 className="text-slate-300 text-base mb-2">
          based on listening history
        </h5>
        <div className="flex flex-col gap-2">
          {isLoading && (
            <>
              <ArtistSkeleton />
              <ArtistSkeleton />
              <ArtistSkeleton />
              <ArtistSkeleton />
              <ArtistSkeleton />
            </>
          )}
          {data?.topArtists.map((artist) => (
            <Link
              to={`/artist/${artist.id}`}
              className="flex gap-2 items-center underline decoration-yellow-900 underline-offset-4 hover:decoration-yellow-500"
              key={artist.id}
            >
              <img
                alt={artist.name}
                src={findImageUrlByMinWidth(artist.images, 40)}
                className="w-10 h-10 rounded-md"
              />

              <span>{artist.name}</span>
            </Link>
          ))}
        </div>
      </CardWithLink>

      <CardWithLink
        title="Top 5 tracks"
        linkTo="/top-tracks"
        linkLabel="All top tracks"
        isLoading={isLoading}
      >
        <h5 className="text-slate-300 text-base mb-2">
          based on listening history
        </h5>
        <div className="flex flex-col gap-2">
          {isLoading && (
            <>
              <TrackSkeleton />
              <TrackSkeleton />
              <TrackSkeleton />
              <TrackSkeleton />
              <TrackSkeleton />
            </>
          )}
          {data?.topTracks.map((track) => (
            <Track track={track} key={track.id} />
          ))}
        </div>
      </CardWithLink>
    </div>
  );
}
