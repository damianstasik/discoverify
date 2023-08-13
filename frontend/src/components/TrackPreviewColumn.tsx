"use client";

import mdiPauseCircle from "@slimr/mdi-paths/PauseCircle";
import mdiPlayCircleOutline from "@slimr/mdi-paths/PlayCircleOutline";
import { CellContext } from "@tanstack/react-table";
import { computed } from "mobx";
import { observer } from "mobx-react-lite";
import { player } from "../state";
import { useEventBus } from "./EventBus";
import { IconButton } from "./IconButton";

const Component = <Data,>(props: CellContext<Data, string>) => {
  const uri = props.getValue();
  const eventBus = useEventBus();

  const isPlaying = computed(() => player.isPlaying(uri)).get();
  const isLoading = computed(() => player.isLoading(uri)).get();

  console.log("track preview", uri, isPlaying, isLoading);

  return (
    <IconButton
      icon={isPlaying ? mdiPauseCircle : mdiPlayCircleOutline}
      className={
        isPlaying ? "text-green-500 hover:text-green-600" : "text-slate-400"
      }
      disabled={isLoading}
      onClick={() => eventBus.emit("playPauseTrack", { uri, isPlaying })}
      label={isPlaying ? "Pause" : "Play"}
    />
  );
};

export const TrackPreviewColumn = observer(Component);
