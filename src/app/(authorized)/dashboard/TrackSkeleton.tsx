import { getRandomArbitrary } from "../../../utils/random";

export function TrackSkeleton() {
  const width1 = getRandomArbitrary(20, 60);
  const width2 = getRandomArbitrary(20, 60);

  return (
    <div className="flex gap-2 items-center">
      <div>
        <div className="animate-pulse s-8 bg-slate-500 rounded-md" />
      </div>
      <div className="flex gap-1 w-full flex-col">
        <div
          className="animate-pulse  bg-slate-500 rounded-md skeleton"
          style={{ width: `${width1}%` }}
        />
        <div
          className="animate-pulse  bg-slate-500 rounded-md skeleton"
          style={{ width: `${width2}%` }}
        />
      </div>
    </div>
  );
}
