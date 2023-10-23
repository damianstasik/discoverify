import { CellContext } from "@tanstack/react-table";

function msToTime(duration: number) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);

  const m = minutes < 10 ? `0${minutes}` : minutes;
  const s = seconds < 10 ? `0${seconds}` : seconds;

  return `${m}:${s}`;
}

export const DurationColumn = <Data,>(props: CellContext<Data, number>) => {
  return msToTime(props.getValue());
};
