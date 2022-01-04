import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import { GridToolbarContainer, useGridApiContext } from '@mui/x-data-grid-pro';
import { Link as RouterLink } from 'react-router-dom';

export function TrackSelectionToolbar() {
  const apiRef = useGridApiContext();
  const selectedRows = apiRef.current.getSelectedRows();

  return (
    <GridToolbarContainer>
      <Collapse in={selectedRows.size > 0}>
        {selectedRows.size < 5 && (
          <Button
            component={RouterLink}
            to={{
              pathname: '/recommendations',
              search: `?${[...selectedRows.keys()]
                .map((selectedRow) => `trackId=${selectedRow}`)
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
              .map((selectedRow) => `trackId=${selectedRow}`)
              .join('&')}`,
          }}
        >
          Create a new playlist
        </Button>
      </Collapse>
    </GridToolbarContainer>
  );
}
