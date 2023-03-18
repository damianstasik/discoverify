import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';

function extractId(value: string) {
  if (value.includes('::')) {
    return value.split('::')[0];
  }

  return value;
}

export const TrackSelectionToolbar = ({ rows }) => {
  return (
    <div className={twMerge('p-3 gap-3', rows.length > 0 ? 'flex' : 'hidden')}>
      {rows.length <= 5 && (
        <Button
          variant='outlined'
          component={Link}
          to={{
            pathname: '/recommendations',
            search: `?${rows
              .map((selectedRow) => `trackId=${extractId(selectedRow.id)}`)
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
            .map((selectedRow) => `trackId=${extractId(selectedRow.id)}`)
            .join('&')}`,
        }}
      >
        Create a new playlist
      </Button>
    </div>
  );
};
