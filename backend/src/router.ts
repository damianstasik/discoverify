import { authRouter } from './auth';
import { router } from './';
import { trackRouter } from './track';
import { seedRouter } from './seed';
import { userRouter } from './user';
import { playlistRouter } from './playlist';
import { playerRouter } from './player';
import { artistRouter } from './artist';

export const appRouter = router({
  auth: authRouter,
  track: trackRouter,
  seed: seedRouter,
  user: userRouter,
  playlist: playlistRouter,
  player: playerRouter,
  artist: artistRouter,
});

export type AppRouter = typeof appRouter;
