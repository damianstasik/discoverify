import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { startTransition, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  useRecoilState_TRANSITION_SUPPORT_UNSTABLE as useRecoilState,
  useSetRecoilState,
} from "recoil";
import { getCurrentUser, refreshAccessToken } from "../api";
// import { useSaveTrackHook } from "../hooks/useSaveTrackHook";
import { savedTracksAtom, userAtom } from "../store";
import { trpc } from "../trpc";
import { Player } from "./Player";
import { Sidebar } from "./Sidebar";

export function Layout() {
  const location = useLocation();
  const [u, setUser] = useRecoilState(userAtom);
  // const setSavedTracks = useSetRecoilState(savedTracksAtom);

  // useEffect(() => {
  //   const sub = trpc.user.onTrackSave.subscribe(undefined, {
  //     onData: (track) => {
  //       setSavedTracks((ids) => {
  //         if (ids.includes(track.id)) {
  //           return ids.filter((id) => id !== track.id);
  //         }

  //         return ids.concat(track.id);
  //       });
  //     },
  //   });

  //   return () => {
  //     sub.unsubscribe();
  //   };
  // }, []);

  const { mutate } = useMutation({
    mutationFn: refreshAccessToken,
    // onSuccess(freshToken) {
    //   startTransition(() => {
    //     setToken(freshToken);
    //   });
    // },
  });

  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryFn: getCurrentUser,
    queryKey: ["user"],
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: true,
    refetchInterval: 60 * 60 * 1000,
  });

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      // check error type, if token is expired run the mutation and update token that will rerun this query
      // need to do this with startTransition to avoid triggering suspense
      mutate();
    }
  }, [error, mutate]);

  if (isLoading || !u) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" state={location} replace />;
  }

  return (
    <div className="flex h-screen">
      <aside className="w-80">
        <Sidebar />
      </aside>

      <main className="bg-slate-900 flex flex-col flex-1">
        <div
          className="flex flex-col relative overflow-hidden"
          style={{
            height: "calc(100% - 100px)",
          }}
        >
          <Outlet />
        </div>

        <div style={{ height: "100px" }} className="mt-auto">
          <Player />
        </div>
      </main>
    </div>
  );
}
