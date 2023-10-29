import Script from "next/script";

export function SpotifyScript() {
  return (
    <>
      <Script src="https://sdk.scdn.co/spotify-player.js" />
    </>
  );
}
