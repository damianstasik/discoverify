import {
  InfiniteData,
  MutationFunction,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { produce } from "immer";
import { useCallback, useEffect } from "react";
// import { useRecoilValue } from "recoil";
import { useEventBus } from "../components/EventBus";
// import { tokenState } from "../store";

const ignoreTrack: MutationFunction<void, string> = async (id) => {
  // await fetch(`${import.meta.env.VITE_API_URL}/track/${id}/ignore`, {
  //   method: isIgnored ? 'delete' : 'put',
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // });
};

export function useIgnoreTrackHook() {
  const queryClient = useQueryClient();
  // const token = useRecoilValue(tokenState);
  const eventBus = useEventBus();

  const { mutate } = useMutation({
    mutationFn: ignoreTrack,
    onSuccess(_, { id, isIgnored }) {
      queryClient.setQueryData<InfiniteData<any>>(
        ["liked"],
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

  const ignore = useCallback((params) => {
    mutate({
      id: params.id,
      isIgnored: params.isIgnored,
    });
  }, []);

  useEffect(() => {
    eventBus.on("ignoreTrack", ignore);

    return () => {
      eventBus.off("ignoreTrack", ignore);
    };
  }, [ignore]);
}
