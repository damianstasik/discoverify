import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  if (req.headers.authorization) {
    const token = req.headers.authorization.slice('bearer'.length).trim();

    return {
      req,
      res,
      rawToken: token,
      token: null,
    };
  }
  return { req, res, token: null, rawToken: null };
}
export type Context = inferAsyncReturnType<typeof createContext>;
