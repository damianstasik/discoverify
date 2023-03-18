export const TrackChipSkeleton = () => {
  return (
    <div className="h-12 px-2 bg-neutral-750 rounded-md flex-shrink-0 flex items-center gap-2">
      <span className="rounded s-8 animate-pulse bg-neutral-600" />
      <div className="flex justify-center flex-col gap-1">
        <span className="rounded text-sm h-em w-32 animate-pulse bg-neutral-600" />
        <span className="rounded text-xs h-em w-24 animate-pulse bg-neutral-600" />
      </div>
    </div>
  );
};
