"use client";

import mdiClose from "@slimr/mdi-paths/Close";
import { useCallback, useTransition } from "react";
import { useSearchParam } from "../hooks/useSearchParam";
import { IconButton } from "./IconButton";

export function ArtistChipRemoveButton({ id }) {
  const searchParam = useSearchParam("artistId");
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
