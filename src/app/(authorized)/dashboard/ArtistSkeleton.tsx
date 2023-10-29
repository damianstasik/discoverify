import { getRandomArbitrary } from "../../../utils/random";

export function ArtistSkeleton() {
  const width = getRandomArbitrary(10, 40);

  return (
    <div className="flex gap-2 items-center">
      <div className="animate-pulse w-10 h-10 bg-slate-500 rounded-md" />
      <div
        className="animate-pulse bg-slate-500 rounded-md skeleton"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
