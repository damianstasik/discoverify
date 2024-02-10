import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { produce } from "immer";
import { useCallback, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { ignoreTrack } from "../api";
import { useEventBus } from "../components/EventBus";
import { tokenState } from "../store";

export function useIgnoreTrackHook() {
  const queryClient = useQueryClient();
  const token = useRecoilValue(tokenState);
  const eventBus = useEventBus();

  const { mutate } = useMutation({
    mutationFn: ignoreTrack,
    onSuccess(_, { id, isIgnored }) {
      queryClient.setQueryData<InfiniteData<any>>(
        ["liked", token],
        produce((draft) => {
          if (!draft) return;

          for (const page of draft.pages) {
            const item = page.tracks.find((t) => t.id === id);

            if (item) {
              item.isIgnored = !isIgnored;
              break;
            }
          }
        }),
      );
    },
  });

  const ignore = useCallback(
    (params) => {
      mutate({
        id: params.id,
        isIgnored: params.isIgnored,
        token,
      });
    },
    [token],
  );

  useEffect(() => {
    eventBus.on("ignoreTrack", ignore);

    return () => {
      eventBus.off("ignoreTrack", ignore);
    };
  }, [ignore]);
}
