import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

// Taken from https://github.com/teetotum/url-search-params-delete/blob/4f6380665e20aa77f402e300c5cfad74f4d866aa/index.js#L5-L17 and modified
// to work with useSearchParams hook
const deleteWithKeyAndValue = function (
  q: URLSearchParams,
  key: string,
  value: string,
) {
  const entriesIterator = q.entries();
  const entries = [...entriesIterator];
  const toBeRestored = entries.filter(([k, v]) => !(k === key && v === value));
  const keysIterator = q.keys();
  const keys = [...keysIterator];
  keys.forEach((k) => q.delete(k));
  toBeRestored.forEach(([k, v]) => q.append(k, v));
  return q;
};

export function useSearchParam(name: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      deleteWithKeyAndValue(params, name, value);

      return params.toString();
    },
    [searchParams, name],
  );

  return {
    remove: (value: string, navigate = true) => {
      const qs = createQueryString(value);

      if (navigate) {
        router.push(`${pathname}?${qs}`);
      } else {
        return `?${qs}`;
      }
    },
  };
}
