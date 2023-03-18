import { useCallback, useEffect, MouseEvent } from 'react';

interface Props<Element extends HTMLElement> {
  ref: React.RefObject<Element>;
  fetchNextPage: () => void;
  isFetching: boolean;
  hasNextPage: boolean;
}

export function useInfiniteLoading<Element extends HTMLElement>({
  ref,
  fetchNextPage,
  isFetching,
  hasNextPage,
}: Props<Element>) {
  const fetchMoreOnBottomReached = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.currentTarget) {
        const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;
        //once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
          !isFetching &&
          hasNextPage
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, hasNextPage],
  );

  useEffect(() => {
    // fetchMoreOnBottomReached(ref.current);
  }, [fetchMoreOnBottomReached]);

  return fetchMoreOnBottomReached;
}
