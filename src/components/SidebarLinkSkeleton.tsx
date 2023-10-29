import { getRandomArbitrary } from "../utils/random";

export function SidebarLinkSkeleton() {
  const width = getRandomArbitrary(20, 90);

  return (
    <p
      className="animate-pulse h-8 rounded-md bg-slate-800"
      role="status"
      style={{ width: `${width}%` }}
    />
  );
}
