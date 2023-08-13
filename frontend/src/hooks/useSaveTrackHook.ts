import { Mutation, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useEventBus } from "../components/EventBus";

const saveTrack: Mutation<"track.save", string> = async (id) => {
  // await trpc.track.save.mutate(id);
};

const unsaveTrack: Mutation<"track.unsave", string> = async (id) => {
  // await trpc.track.unsave.mutate(id);
};

export function useSaveTrackHook() {
  const eventBus = useEventBus();
  const { mutate: saveTrackMutation } = useMutation({ mutationFn: saveTrack });
  const { mutate: unsaveTrackMutation } = useMutation({
    mutationFn: unsaveTrack,
  });

  useEffect(() => {
    const handle = ({ id, isSaved }) => {
      if (isSaved) {
        unsaveTrackMutation(id);
      } else {
        saveTrackMutation(id);
      }
    };

    eventBus.on("saveTrack", handle);

    return () => {
      eventBus.off("saveTrack", handle);
    };
  }, []);
}
