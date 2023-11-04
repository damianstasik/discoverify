export async function ArtistInfoSkeleton() {
  return (
    <div className="relative">
      <div className="border-b border-white/5 backdrop-blur-lg">
        <h2 className="p-3 text-xl/none text-white font-bold">
          <div className="animate-pulse h-em w-48 bg-slate-600 rounded-md" />
        </h2>
      </div>
    </div>
  );
}
