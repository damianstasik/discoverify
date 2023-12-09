"use client";

import mdiClose from "@slimr/mdi-paths/Close";
import { IconButton } from "./IconButton";

import { useCallback, useTransition } from "react";
import { useSearchParam } from "../hooks/useSearchParam";

export function TrackChipRemoveButton({ id }) {
  const searchParam = useSearchParam("trackId");

  const [isPending, startTransition] = useTransition();

  const handleDelete = useCallback(() => {
    startTransition(() => {
      searchParam.remove(id);
    });
  }, [id, searchParam]);

  return (
    <IconButton
      disabled={isPending}
      icon={mdiClose}
      label="Remove"
      className="text-slate-400"
      onClick={handleDelete}
    />
  );
}
