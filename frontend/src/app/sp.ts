import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  redirectUri: process.env.VERCEL
    ? `https://${process.env.VERCEL_BRANCH_URL}${process.env.SPOTIFY_REDIRECT_URI}`
    : process.env.SPOTIFY_REDIRECT_URI,
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export const getSpotifyApi = (accessToken?: string): SpotifyWebApi => {
  if (accessToken) {
    spotifyApi.setAccessToken(accessToken);
  }

  return spotifyApi;
};
