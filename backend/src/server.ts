import 'dotenv/config';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import cors from '@fastify/cors';
import { createContext } from './context';
import { appRouter } from './router';
import cookie from '@fastify/cookie';
import ws from '@fastify/websocket';

const port = process.env.PORT || 3000;

const server = fastify({
  maxParamLength: 5000,
});

server.register(ws);
server.register(cookie);

server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  useWSS: true,
  trpcOptions: { router: appRouter, createContext },
});

(async () => {
  await server.register(cors, {
    credentials: true,
    origin: new RegExp(process.env.CORS_ORIGIN),
  });

  try {
    await server.listen({ host: '0.0.0.0', port });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
