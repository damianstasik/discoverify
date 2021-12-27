import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import { GridToolbarContainer, useGridApiContext } from '@mui/x-data-grid-pro';
import { Link as RouterLink } from 'react-router-dom';

export function RecommendationToolbar() {
  const apiRef = useGridApiContext();
  const selectedRows = apiRef.current.getSelectedRows();

  return (
    <GridToolbarContainer>
      <Collapse in={selectedRows.size > 0}>
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
      </Collapse>
    </GridToolbarContainer>
  );
}
