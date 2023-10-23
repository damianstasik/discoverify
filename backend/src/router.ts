import { router } from "./";
import { albumRouter } from "./album";
import { artistRouter } from "./artist";
import { authRouter } from "./auth";
import { playerRouter } from "./player";
import { playlistRouter } from "./playlist";
import { seedRouter } from "./seed";
import { trackRouter } from "./track";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  track: trackRouter,
  seed: seedRouter,
  user: userRouter,
  playlist: playlistRouter,
  player: playerRouter,
  artist: artistRouter,
  album: albumRouter,
});

export type AppRouter = typeof appRouter;
