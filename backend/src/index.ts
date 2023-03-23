import { initTRPC } from '@trpc/server';
import { Context } from './context';
import EventEmitter from 'node:events';

const t = initTRPC.context<Context>().create();
export const ee = new EventEmitter();

export const { router, procedure, middleware } = t;
