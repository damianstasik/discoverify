import { MouseEvent, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  fetchNextPage: () => void;
  isFetching: boolean;
  hasNextPage: boolean;
}

export function useInfiniteLoading({
  fetchNextPage,
  isFetching,
  hasNextPage,
}: Props) {
  const handler = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const { scrollHeight, scrollTop, clientHeight } =
        event.target as HTMLElement;
      //once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
      if (
        scrollHeight - scrollTop - clientHeight < 300 &&
        !isFetching &&
        hasNextPage
      ) {
        fetchNextPage();
      }
    },
    [fetchNextPage, isFetching, hasNextPage],
  );

  return useDebouncedCallback(handler, 100);
}
