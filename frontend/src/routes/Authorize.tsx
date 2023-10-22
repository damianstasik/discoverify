import { useSuspenseQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { trpc } from "../trpc";

const authorizeQuery: Query<"auth.authorize", [key: string, code: string]> =
  async ({ queryKey, signal }) => {
    await trpc.auth.authorize.query(queryKey[1], { signal });
    return queryKey[1];
  };

export function Authorize() {
  const [searchParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();

  const code = searchParams.get("code");

  const { isSuccess, errorUpdateCount } = useSuspenseQuery({
    queryKey: ["authorize", code!],
    queryFn: authorizeQuery,
  });

  useEffect(() => {
    if (errorUpdateCount) {
      enqueueSnackbar("Authorization error", {
        variant: "error",
      });
    }
  }, [errorUpdateCount]);

  return <Navigate to={isSuccess ? "/recommendations" : "/login"} />;
}
