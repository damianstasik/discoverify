import { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { deviceIdAtom } from '../store';

interface Options {
  name: string;
  getOAuthToken: () => Promise<string>;
  onPlayerStateChanged: Spotify.PlaybackStateListener;
  volume: number;
}

export function useSpotifyWebPlaybackSdk({
  name,
  getOAuthToken,
  onPlayerStateChanged,
  volume,
}: Options) {
  const playerRef = useRef<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useRecoilState(deviceIdAtom);

  useEffect(() => {
    if (window.Spotify) {
      console.log('spot');
      playerRef.current = new Spotify.Player({
        name,
        getOAuthToken: async (cb) => {
          const token = await getOAuthToken();
          cb(token);
        },
        volume,
      });

      playerRef.current.addListener('ready', ({ device_id }) => {
        setDeviceId(device_id);
      });

      playerRef.current.connect();
    }
  }, []);

  useEffect(() => {
    playerRef.current?.addListener(
      'player_state_changed',
      onPlayerStateChanged,
    );

    return () => {
      playerRef.current?.removeListener(
        'player_state_changed',
        onPlayerStateChanged,
      );
    };
  }, [onPlayerStateChanged]);

  return {
    player: playerRef.current,
    deviceId,
  };
}
