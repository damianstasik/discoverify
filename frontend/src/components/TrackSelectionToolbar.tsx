import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';
import { Row } from '@tanstack/react-table';

function extractId(value: string) {
  if (value.includes('::')) {
    return value.split('::')[0];
  }

  return value;
}

interface Props<T extends { spotifyId: string } = any> {
  rows: Row<T>[];
}

export const TrackSelectionToolbar = <T extends { spotifyId: string }>({
  rows,
}: Props<T>) => {
  return (
    <div
      className={twMerge(
        'p-3 gap-3 border-b border-white/20 border-white/20 backdrop-blur-lg',
        rows.length > 0 ? 'flex' : 'hidden',
      )}
    >
      {rows.length <= 5 && (
        <Button
          variant='outlined'
          component={Link}
          to={{
            pathname: '/recommendations',
            search: `?${rows
              .map(
                (selectedRow) =>
                  `trackId=${extractId(selectedRow.original.spotifyId)}`,
              )
              .join('&')}`,
          }}
        >
          Generate recommendations
        </Button>
      )}

      <Button
        variant='outlined'
        component={Link}
        to={{
          pathname: '/playlist/create',
          search: `?${rows
            .map(
              (selectedRow) =>
                `trackId=${extractId(selectedRow.original.spotifyId)}`,
            )
            .join('&')}`,
        }}
      >
        Create a new playlist
      </Button>
    </div>
  );
};
