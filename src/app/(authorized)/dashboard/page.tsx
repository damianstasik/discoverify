import Link from "next/link";
import { Suspense } from "react";
import { Button } from "../../../components/Button";
import { ArtistSkeleton } from "./ArtistSkeleton";
import { Card } from "./Card";
import { CardWithLink } from "./CardWithLink";
import { FollowedArtists } from "./FollowedArtists";
import { LikedTracks } from "./LikedTracks";
import { RecentlyPlayed } from "./RecentlyPlayed";
import { TopArtists } from "./TopArtists";
import { TopTracks } from "./TopTracks";
import { TrackSkeleton } from "./TrackSkeleton";

export default function Dashboard() {
  return (
    <div className="p-3 grid gap-4 grid-cols-3">
      <Card title="Liked tracks">
        <h6 className="text-2xl/none text-white oldstyle-nums mt-3">
          <Suspense
            fallback={
              <div className="animate-pulse h-em w-16 bg-slate-500 rounded-md" />
            }
          >
            <LikedTracks />
          </Suspense>
        </h6>
        <p className="text-slate-300 text-sm">on Spotify</p>

        <Button
          variant="outlined"
          component={Link}
          href="/liked"
          className="mt-3"
        >
          All liked tracks
        </Button>
      </Card>
      <Card title="Followed artists">
        <h6 className="text-2xl/none text-white oldstyle-nums mt-3">
          <Suspense
            fallback={
              <div className="animate-pulse h-em w-16 bg-slate-500 rounded-md" />
            }
          >
            <FollowedArtists />
          </Suspense>
        </h6>
        <p className="text-slate-300 text-sm">on Spotify</p>

        <Button
          variant="outlined"
          component={Link}
          href="/artists"
          className="mt-3"
        >
          All followed artists
        </Button>
      </Card>
      <Card title="Recently played track">
        <div className="my-3">
          <Suspense fallback={<TrackSkeleton />}>
            <RecentlyPlayed />
          </Suspense>
        </div>

        <Button variant="outlined" component={Link} href="/recently-played">
          More recently played tracks
        </Button>
      </Card>
      <CardWithLink
        title="Top 5 artists"
        linkTo="/top-artists"
        linkLabel="All top artists"
      >
        <h5 className="text-slate-300 text-base mb-3">
          based on listening history
        </h5>
        <div className="flex flex-col gap-2">
          <Suspense
            fallback={
              <>
                <ArtistSkeleton />
                <ArtistSkeleton />
                <ArtistSkeleton />
                <ArtistSkeleton />
                <ArtistSkeleton />
              </>
            }
          >
            <TopArtists />
          </Suspense>
        </div>
      </CardWithLink>
      <CardWithLink
        title="Top 5 tracks"
        linkTo="/top-tracks"
        linkLabel="All top tracks"
      >
        <h5 className="text-slate-300 text-base mb-3">
          based on listening history
        </h5>
        <div className="flex flex-col gap-2">
          <Suspense
            fallback={
              <>
                <TrackSkeleton />
                <TrackSkeleton />
                <TrackSkeleton />
                <TrackSkeleton />
                <TrackSkeleton />
              </>
            }
          >
            <TopTracks />
          </Suspense>
        </div>
      </CardWithLink>
    </div>
  );
}
