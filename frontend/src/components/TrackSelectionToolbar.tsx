import { Row } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { tw } from "../tw";
import { Button } from "./Button";

function extractId(value: string) {
  if (value.includes("::")) {
    return value.split("::")[0];
  }

  return value;
}

interface Props<T extends { spotifyId: string } = any> {
  rows: Row<T>[];
}

export const TrackSelectionToolbar = <T extends { spotifyId: string }>({
  rows,
}: Props<T>) => {
  return (
    <div
      className={tw(
        "p-3 gap-3 border-b border-white/5 backdrop-blur-lg",
        rows.length > 0 ? "flex" : "hidden",
      )}
    >
      {rows.length <= 5 && (
        <Button
          variant="outlined"
          component={Link}
          to={{
            pathname: "/recommendations",
            search: `?${rows
              .map(
                (selectedRow) =>
                  `trackId=${extractId(selectedRow.original.spotifyId)}`,
              )
              .join("&")}`,
          }}
        >
          Generate recommendations
        </Button>
      )}

      <Button
        variant="outlined"
        component={Link}
        to={{
          pathname: "/playlist/create",
          search: `?${rows
            .map(
              (selectedRow) =>
                `trackId=${extractId(selectedRow.original.spotifyId)}`,
            )
            .join("&")}`,
        }}
      >
        Create a new playlist
      </Button>
    </div>
  );
};
