import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { parse } from 'cookie';

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  const cookie = req.headers['cookie'];

  const parsedCookie = parse(cookie || '');

  if (parsedCookie?.token) {
    return {
      req,
      res,
      rawToken: parsedCookie.token,
      token: null,
    };
  }

  return { req, res, token: null, rawToken: null };
}
export type Context = inferAsyncReturnType<typeof createContext>;
