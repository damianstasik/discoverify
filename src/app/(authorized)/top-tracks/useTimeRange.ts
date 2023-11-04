import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useTimeRange() {
  const searchParams = useSearchParams()!;
  const pathname = usePathname();

  const getTimeRangeUrl = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("timeRange", value);

      return `${pathname}?${params.toString()}`;
    },
    [searchParams, pathname],
  );

  return {
    timeRange: searchParams.get("timeRange") ?? "short_term",
    getTimeRangeUrl,
  };
}
