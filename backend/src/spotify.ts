import SpotifyWebApi from 'spotify-web-api-node';

export const spotifyApi = new SpotifyWebApi({
  redirectUri: 'http://localhost:5173/authorize',
  clientId: '',
  clientSecret: '',
});

export const getSpotifyApi = (accessToken?: string): SpotifyWebApi => {
  if (accessToken) {
    spotifyApi.setAccessToken(accessToken);
  }

  return spotifyApi;
};
