import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { tokenState } from '../store';

function ArtistCardSkeleton() {
  return (
    <div>
      <div variant="rectangular" height={300} animation="wave" />
      <div>
        <div variant="h6">
          <div animation="wave" />
        </div>
      </div>
      <div disableSpacing>
        <div variant="rectangular" animation="wave">
          {/* <div startIcon={<PersonAddTwoToneIcon />}>
            Follow
          </div> */}
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
    <div>
      <div component={RouterLink} to={`/artist/${artist.id}`}>
        <div
          sx={{
            height: 300,
          }}
          src={artist.images.length > 1 ? artist.images[1].url : ''}
          title={artist.name}
          component="img"
          loading="lazy"
        />
      </div>
      <div>
        <div variant="h6">{artist.name}</div>

        <div dense>
          {artist.tracks.map((tr: any) => (
            <div key={tr.id} disableGutters>
              <div
                primary={tr.name}
                secondary={tr.artists.map((a) => a.name).join(', ')}
              />
            </div>
          ))}
        </div>
      </div>
      <div disableSpacing>
        {/* <div
          onClick={handleFollow}
          sx={{ color: 'green' }}
          loading={isLoading}
          startIcon={<PersonAddTwoToneIcon />}
          loadingPosition="start"
        >
          {isFollowing ? 'Following' : 'Follow'}
        </div> */}
        {/* <Button
          className="mt-auto"
          icon={isFollowing ? undefined : 'add'}
          intent={isFollowing ? 'success' : 'none'}
          active={isFollowing}
          loading={isLoading}
          onClick={handleFollow}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Button> */}
      </div>
    </div>
  );
}

export function Artists() {
  const [isLoading, setLoading] = useState(true);
  const [artists, setArtists] = useState([]);
  const token = useRecoilValue(tokenState);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/artists?tokenId=${token}`)
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        setArtists(res.artists);
      });
  }, []);

  return (
    <>
      <div variant="h5" gutterBottom>
        Artists from liked tracks
      </div>

      <div container spacing={3}>
        {isLoading ? (
          <>
            <div item xs={3}>
              <ArtistCardSkeleton />
            </div>
            <div item xs={3}>
              <ArtistCardSkeleton />
            </div>
            <div item xs={3}>
              <ArtistCardSkeleton />
            </div>
            <div item xs={3}>
              <ArtistCardSkeleton />
            </div>
            <div item xs={3}>
              <ArtistCardSkeleton />
            </div>
            <div item xs={3}>
              <ArtistCardSkeleton />
            </div>
            <div item xs={3}>
              <ArtistCardSkeleton />
            </div>
            <div item xs={3}>
              <ArtistCardSkeleton />
            </div>
            <div item xs={3}>
              <ArtistCardSkeleton />
            </div>
            <div item xs={3}>
              <ArtistCardSkeleton />
            </div>
          </>
        ) : (
          artists.map((artist: any) => (
            <div item xs={3} key={artist.id}>
              <ArtistCard artist={artist} />
            </div>
          ))
        )}
      </div>
    </>
  );
}
