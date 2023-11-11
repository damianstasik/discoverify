"use client";

import mdiPauseCircle from "@slimr/mdi-paths/PauseCircle";
import mdiPlayCircleOutline from "@slimr/mdi-paths/PlayCircleOutline";
import { computed } from "mobx";
import { observer } from "mobx-react-lite";
import { player } from "../state";

import { IconButton } from "./IconButton";
import { useCallback, useTransition } from "react";

import { playTrack } from "../api/playTrack";

interface Props {
  trackId: string;
  trackIds?: string[];
}

function Component({ trackId, trackIds }: Props) {
  const isPlaying = computed(() => player.isPlaying(trackId)).get();

  const [isSaving, startTransition] = useTransition();

  const handleSave = useCallback(
    () =>
      startTransition(async () => {
        await playTrack({
          trackIds: trackIds ?? [trackId],
          trackId,
          deviceId: player.deviceId,
        });

        player.setPlayingTrackId(trackId);
      }),
    [trackIds, trackId, player.deviceId],
  );

  return (
    <IconButton
      icon={isPlaying ? mdiPauseCircle : mdiPlayCircleOutline}
      className={
        isPlaying ? "text-green-500 hover:text-green-600" : "text-slate-400"
      }
      disabled={isSaving}
      onClick={handleSave}
      label={isPlaying ? "Pause" : "Play"}
    />
  );
}

export const PlayPauseButton = observer(Component);
