import { TimeRangeOption } from "./TimeRangeOption";

export function TimeRange() {
  return (
    <div className="flex items-center gap-3 border-b border-white/5 p-3">
      <div className="font-semibold">Time range:</div>
      <TimeRangeOption value="short_term" label="Last 4 weeks" />
      <TimeRangeOption value="medium_term" label="Last 6 months" />
      <TimeRangeOption
        value="long_term"
        label="Last few years"
        title="Calculated from several years of data and including all new data as it becomes available"
      />
    </div>
  );
}
