import EventEmitter from "node:events";
import { initTRPC } from "@trpc/server";
import { Context } from "./context";

const t = initTRPC.context<Context>().create();
export const ee = new EventEmitter();

export const { router, procedure, middleware } = t;
