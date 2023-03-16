import { Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import { Link as RouterLink } from 'react-router-dom';

function extractId(value: string) {
  if (value.includes('::')) {
    return value.split('::')[0];
  }

  return value;
}

export const TrackSelectionToolbar = ({ rows }) => {
  return (
    <Collapse in={rows.length > 0}>
      <Box sx={{ p: 1 }}>
        {rows.length <= 5 && (
          <Button
            component={RouterLink}
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
          component={RouterLink}
          to={{
            pathname: '/playlist/create',
            search: `?${rows
              .map((selectedRow) => `trackId=${extractId(selectedRow.id)}`)
              .join('&')}`,
          }}
        >
          Create a new playlist
        </Button>
      </Box>
      <Divider />
    </Collapse>
  );
};
