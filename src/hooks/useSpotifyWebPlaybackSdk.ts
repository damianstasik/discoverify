"use client";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { deviceIdAtom } from "../store";
import { player } from "../state";

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
  const [spotifyPlayer, setSpotifyPlayer] = useState<Spotify.Player | null>(
    null,
  );

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const pl = new Spotify.Player({
        name,
        getOAuthToken: async (cb) => {
          const token = await getOAuthToken();
          cb(token);
        },
        volume,
      });

      setSpotifyPlayer(pl);

      pl.addListener("ready", ({ device_id }) => {
        player.setDeviceId(device_id);
      });

      pl.connect();
    };
  }, []);

  useEffect(() => {
    if (spotifyPlayer) {
      spotifyPlayer.addListener("player_state_changed", onPlayerStateChanged);

      return () => {
        spotifyPlayer.removeListener(
          "player_state_changed",
          onPlayerStateChanged,
        );
      };
    }
  }, [onPlayerStateChanged, spotifyPlayer]);

  return spotifyPlayer;
}
