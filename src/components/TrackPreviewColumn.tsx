"use client";

import mdiPauseCircle from "@slimr/mdi-paths/PauseCircle";
import mdiPlayCircleOutline from "@slimr/mdi-paths/PlayCircleOutline";
import { CellContext } from "@tanstack/react-table";
import { computed } from "mobx";
import { observer } from "mobx-react-lite";
import { player } from "../state";

import { IconButton } from "./IconButton";
import { useCallback, useTransition } from "react";

import { playTrack } from "../api/playTrack";
import { castSpotifyId } from "../utils/castSpotifyId";

const Component = <Data,>(props: CellContext<Data, string>) => {
  const uri = props.getValue();

  const isPlaying = computed(() => player.isPlaying(uri)).get();

  const [isSaving, startTransition] = useTransition();

  const handleSave = useCallback(
    () =>
      startTransition(async () => {
        const result = await playTrack({
          trackIds: castSpotifyId(props.table.options.meta),
          trackId: castSpotifyId(uri),
          deviceId: player.deviceId,
        });
        console.log("play track", result);
        if (result) {
          player.setPlayingTrackId(uri);
        }
      }),
    [props.table.options.meta, uri, player.deviceId],
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
};

export const TrackPreviewColumn = observer(Component);
