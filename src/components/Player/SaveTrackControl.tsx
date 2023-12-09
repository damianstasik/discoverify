"use client";

import { SaveTrackButton } from "../SaveTrackButton";

import { useQuery } from "@tanstack/react-query";
import { isTrackSaved } from "../../api/isTrackSaved";

export function SaveTrackControl({ trackId }) {
  const { data } = useQuery({
    queryKey: ["is-saved", trackId],
    queryFn: () => isTrackSaved(trackId),
    placeholderData: false,
    enabled: !!trackId,
  });

  return <SaveTrackButton trackId={trackId} isSaved={data} key={data} />;
}
