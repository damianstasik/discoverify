import { mdiThumbDown, mdiThumbDownOutline } from "@mdi/js";
import { CellContext } from "@tanstack/react-table";
import { useEventBus } from "./EventBus";
import { IconButton } from "./IconButton";

export const IgnoreColumn = <Data extends { id: string }>(
  props: CellContext<Data, boolean>,
) => {
  const eventBus = useEventBus();
  const isIgnored = props.getValue();

  return (
    <IconButton
      icon={isIgnored ? mdiThumbDown : mdiThumbDownOutline}
      label="Ignore"
      onClick={() => eventBus.emit("ignoreTrack", props.row.original.id)}
      className="p-1 text-white"
    />
  );
};
