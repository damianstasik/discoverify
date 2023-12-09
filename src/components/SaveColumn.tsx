import { CellContext } from "@tanstack/react-table";

import { SaveTrackButton } from "./SaveTrackButton";

export function SaveColumn<Data extends { id: string }>(
  props: CellContext<Data, boolean>,
) {
  const isSaved = props.getValue();
  return (
    <SaveTrackButton
      label="Save"
      isSaved={isSaved}
      trackId={props.row.original.id}
      className={`p-1 ${isSaved ? "text-white" : "text-slate-400"}`}
    />
  );
}
