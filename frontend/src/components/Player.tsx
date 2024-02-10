import { mdiDevices, mdiHeart, mdiHeartOutline } from "@mdi/js";
import { useQuery } from "@tanstack/react-query";
import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useThrottledCallback } from "use-debounce";
import { useSpotifyWebPlaybackSdk } from "../hooks/useSpotifyWebPlaybackSdk";
import { useTimer } from "../hooks/useTimer";
import { player as pl } from "../state";
import {
  playerVolumeAtom,
  queueVisibilityAtom,
  savedTracksAtom,
  userAtom,
} from "../store";
import { trpc } from "../trpc";
import { useEventBus } from "./EventBus";
import { IconButton } from "./IconButton";
import { PlaybackControl } from "./Player/PlaybackControl";
import { QueueButton } from "./Player/QueueButton";
import { SeekControl } from "./Player/SeekControl";
import { TrackInfo } from "./Player/TrackInfo";
import { VolumeControl } from "./Player/VolumeControl";

export const Player = observer(() => {
  const user = useRecoilValue(userAtom);

  const decoded = user?.accessToken;

  // const { data = [], isLoading } = useQuery(['devices', tokenId], async () => {
  //   const res = await fetch(`/devices?tokenId=${tokenId}`);
  //   const body = await res.json();
  //   return body;
  // });

  const { time, start, pause, set, status } = useTimer("player");
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useRecoilState(playerVolumeAtom);
  const [isChangingVolume, setIsChangingVolume] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);

  const [meta, setMeta] = useState<Spotify.PlaybackContextMetadata | null>(
    null,
  );

  const h = useCallback(
    (state) => {
      setDuration(state.duration / 1000);
      setMeta(state.context.metadata);

      runInAction(() => {
        pl.resetLoadingTrackId();
        pl.setPlayingTrackId(state.context.metadata?.current_item.uri);
      });

      set(state.position / 1000);

      if (state.paused && status === "RUNNING") {
        pause();
      }

      if (!state.paused && status !== "RUNNING") {
        start();
      }
    },
    [status],
  );

  useEffect(() => {
    if (isSeeking && status === "RUNNING") {
      pause();
    }
  }, [isSeeking, status]);

  const { deviceId, player } = useSpotifyWebPlaybackSdk({
    name: "Discoverify",
    getOAuthToken: () => decoded,
    onPlayerStateChanged: h,
    volume,
  });

  const { data: vol } = useQuery({
    queryKey: ["volume", deviceId],
    queryFn: async () => player!.getVolume(),
    enabled: player !== null && pl.isPlaying() && !isChangingVolume,
    refetchInterval: 2500,
  });

  useEffect(() => {
    if (typeof vol !== "undefined") {
      setVolume(vol);
    }
  }, [vol]);

  const handlePrevious = useCallback(() => {
    player?.previousTrack();
  }, [player]);

  const handleNext = useCallback(() => {
    player?.nextTrack();
  }, [player]);

  const handlePlayPause = useCallback(() => {
    player?.togglePlay();
  }, [player]);

  const handlePositionChange = useCallback((v) => {
    set(v);
    setIsSeeking(true);
  }, []);

  const handlePositionCommit = useCallback(
    (v) => {
      player?.seek(v * 1000);
      setIsSeeking(false);
    },
    [player],
  );

  const changeVolume = useCallback(
    (v) => {
      player?.setVolume(v);
    },
    [player],
  );

  const handleVolumeCommit = useCallback(
    (v) => {
      changeVolume(v);
      setIsChangingVolume(false);
    },
    [changeVolume],
  );

  const thottledVolumeChange = useThrottledCallback(changeVolume, 100);

  const handleVolumeChange = useCallback(
    (v) => {
      setIsChangingVolume(true);
      setVolume(v);
      thottledVolumeChange(v);
    },
    [thottledVolumeChange],
  );

  const [isQueueOpen, setIsQueueOpen] = useRecoilState(queueVisibilityAtom);

  const { data: queue } = useQuery({
    queryKey: ["queue"],
    queryFn: async ({ signal }) => {
      const queue = await trpc.player.queue.query(undefined, { signal });
      return queue;
    },
    enabled: isQueueOpen,
  });

  const eventBus = useEventBus();
  const savedTracks = useRecoilValue(savedTracksAtom);
  const id = meta?.current_item?.uri?.replace("spotify:track:", "");

  const isSaved = id ? savedTracks.includes(id) : false;

  const handleSave = useCallback(() => {
    eventBus.emit("saveTrack", {
      id,
      isSaved,
    });
  }, [isSaved, id]);

  return (
    <div className="bg-slate-700 flex px-3 py-2 h-full">
      <div className="flex gap-2 items-center w-full">
        <div className="w-3/12">
          <TrackInfo
            name={meta?.current_item.name}
            artists={meta?.current_item.artists}
            imageUrl={meta?.current_item.images[0].url}
          />
        </div>

        <div className="w-4/12 justify-center flex flex-col">
          <div className="flex flex-col items-center gap-2">
            <PlaybackControl
              isPlaying={pl.isPlaying()}
              onPlayPauseClick={handlePlayPause}
              onNextClick={handleNext}
              onPreviousClick={handlePrevious}
            />
            <SeekControl
              position={time}
              duration={duration}
              onChange={handlePositionChange}
              onCommit={handlePositionCommit}
            />
          </div>
        </div>

        <div className="w-3/12 justify-center flex flex-col">
          <VolumeControl
            volume={volume}
            onChange={handleVolumeChange}
            onCommit={handleVolumeCommit}
          />
        </div>
        <div className="w-2/12 text-white">
          <IconButton
            icon={isSaved ? mdiHeart : mdiHeartOutline}
            onClick={handleSave}
          />
          <QueueButton
            queue={queue || []}
            isOpen={isQueueOpen}
            onVisibilityChange={(v) => setIsQueueOpen(v)}
          />
          <IconButton icon={mdiDevices} />
        </div>
      </div>
    </div>
  );
});
