import { useQuery } from "@tanstack/react-query";
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

export function Track({ params }) {
  const token = useRecoilValue(tokenState);
  // const params = useParams<{ id: string }>();

  const { data } = useQuery({
    queryKey: ["track", params.id, token],
    queryFn: trackQuery,
    refetchOnMount: true,
  });

  return <div>{data?.name}</div>;
}
