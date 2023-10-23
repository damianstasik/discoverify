import { TRPCError } from "@trpc/server";
import { TokenExpiredError } from "jsonwebtoken";
import * as jwt from "jsonwebtoken";
import { middleware, procedure } from "..";

export interface AuthTokenInterface {
  accessToken: string;
  refreshToken: string;
  userId: string;

  iat: number;
  exp: number;
}

type MiddlewareOptions = {
  ignoreExpiration?: boolean;
};

export const withAuthToken = (options?: MiddlewareOptions) =>
  middleware(async ({ ctx, next }) => {
    if (!ctx.rawToken) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    try {
      const token = jwt.verify(ctx.rawToken, process.env.JWT_SECRET, {
        ignoreExpiration: options?.ignoreExpiration,
      }) as AuthTokenInterface;

      return next({
        ctx: {
          token: token,
          rawToken: ctx.rawToken,
        },
      });
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "token_expired",

          cause: e,
        });
      }

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "malformed_header",

        cause: e,
      });
    }
  });

export const procedureWithAuthToken = procedure.use(withAuthToken());
