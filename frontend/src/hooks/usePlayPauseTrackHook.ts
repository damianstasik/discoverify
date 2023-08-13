import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { useRecoilValue } from "recoil";

import { playTrack } from "../api/play";
import { pausePlayer } from "../api/player";
import { useEventBus } from "../components/EventBus";
import { player } from "../state";
import { deviceIdAtom } from "../store";

export function usePlayPauseTrackHook(trackIds: string[]) {
  const eventBus = useEventBus();
  const deviceId = useRecoilValue(deviceIdAtom);

  const { mutate: play } = useMutation({
    mutationFn: playTrack,
    onError() {
      player.resetLoadingTrackId();
    },
  });

  const { mutate: pause } = useMutation({
    mutationFn: () => {
      return pausePlayer(deviceId);
    },
    onSuccess() {
      player.resetPlayingTrackId();
    },
    onSettled() {
      player.resetLoadingTrackId();
    },
  });

  const handler = useCallback(
    ({ uri, isPlaying }) => {
      player.setLoadingTrackId(uri);

      if (isPlaying) {
        pause();
      } else {
        play({
          trackIds,
          offset: uri,
          deviceId,
        });
      }
    },
    [trackIds, deviceId],
  );

  useEffect(() => {
    eventBus.on("playPauseTrack", handler);

    return () => {
      eventBus.off("playPauseTrack", handler);
    };
  }, [handler]);
}
