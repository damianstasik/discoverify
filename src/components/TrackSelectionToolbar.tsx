import { Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import { useGridApiContext } from '@mui/x-data-grid-premium';
import { Link as RouterLink } from 'react-router-dom';

function extractId(value: string) {
  if (value.includes('::')) {
    return value.split('::')[0];
  }

  return value;
}

export function TrackSelectionToolbar() {
  const apiRef = useGridApiContext();
  const selectedRows = apiRef.current.getSelectedRows();

  return (
    <Collapse in={selectedRows.size > 0}>
      <Box sx={{ p: 1 }}>
        {selectedRows.size <= 5 && (
          <Button
            component={RouterLink}
            to={{
              pathname: '/recommendations',
              search: `?${[...selectedRows.keys()]
                .map((selectedRow) => `trackId=${extractId(selectedRow)}`)
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
            search: `?${[...selectedRows.keys()]
              .map((selectedRow) => `trackId=${extractId(selectedRow)}`)
              .join('&')}`,
          }}
        >
          Create a new playlist
        </Button>
      </Box>
      <Divider />
    </Collapse>
  );
}
