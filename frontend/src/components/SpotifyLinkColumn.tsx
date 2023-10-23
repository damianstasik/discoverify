import { mdiSpotify } from "@mdi/js";
import { CellContext } from "@tanstack/react-table";
import { IconButton } from "./IconButton";

export const SpotifyLinkColumn = <Data,>(props: CellContext<Data, string>) => {
  return (
    <IconButton
      icon={mdiSpotify}
      label="Open in Spotify"
      href={props.getValue()}
      className="p-1 text-white"
      target="_blank"
    />
  );
};
