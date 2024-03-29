import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { tokenState } from "../store";

async function trackQuery({ queryKey, signal }) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/track/${queryKey[1]}`,
    {
      signal,
      headers: {
        Authorization: `Bearer ${queryKey[2]}`,
      },
    },
  );
  const body = await res.json();

  return body;
}

export function Track() {
  const token = useRecoilValue(tokenState);
  const params = useParams<{ id: string }>();

  const { data } = useQuery(["track", params.id, token], trackQuery, {
    refetchOnMount: true,
  });

  return <div>{data?.name}</div>;
}
