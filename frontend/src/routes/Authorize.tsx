import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { trpc } from "../trpc";

const authorizeQuery: Query<"auth.authorize", [key: string, code: string]> =
  async ({ queryKey }) => {
    await trpc.auth.authorize.query(queryKey[1]);
    return queryKey[1];
  };

export function Authorize() {
  const [searchParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();

  const code = searchParams.get("code");

  const { isSuccess, error, isLoading } = useQuery({
    queryKey: ["authorize", code!],
    queryFn: authorizeQuery,
  });

  useEffect(() => {
    if (error) {
      enqueueSnackbar("Authorization error", {
        variant: "error",
      });
    }
  }, [error]);

  if (isLoading) {
    return null;
  }

  return <Navigate to={isSuccess ? "/recommendations" : "/login"} />;
}
