import { SxProps, Theme } from '@mui/material';
import {
  DataGridPremium,
  DataGridPremiumProps,
} from '@mui/x-data-grid-premium';

const styles: SxProps<Theme> = {
  border: 0,
  background: 'none',

  '.MuiDataGrid-columnSeparator': {
    display: 'none',
  },

  '.MuiDataGrid-columnHeaderTitleContainer': {
    padding: 0,
  },

  '.MuiDataGrid-columnHeaderTitle': {
    color: '#fff',
    fontWeight: 600,
  },

  '.MuiDataGrid-cell': {
    border: 0,
  },

  '.MuiDataGrid-columnHeaders': {
    mb: 2,
  },

  '.MuiDataGrid-row': {
    borderRadius: '6px',
  },
};

export function Table(props: DataGridPremiumProps) {
  return (
    <DataGridPremium
      sx={styles}
      disableSelectionOnClick
      disableColumnResize
      disableColumnMenu
      disableColumnReorder
      disableColumnSelector
      disableDensitySelector
      disableMultipleColumnsSorting
      disableColumnFilter
      disableMultipleColumnsFiltering
      hideFooter
      getRowHeight={() => 'auto'}
      {...props}
    />
  );
}
