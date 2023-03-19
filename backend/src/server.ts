import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import cors from '@fastify/cors';
import { createContext } from './context';
import { appRouter } from './router';

const port = process.env.PORT || 3000;

const server = fastify({
  maxParamLength: 5000,
});

server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: { router: appRouter, createContext },
});

(async () => {
  await server.register(cors, {
    // credentials: true,
    // origin: 'http://localhost:5173',
  });

  try {
    await server.listen({ host: '0.0.0.0', port });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
