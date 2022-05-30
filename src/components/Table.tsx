import { SxProps, Theme } from '@mui/material';
import {
  DataGridPremium,
  DataGridPremiumProps,
} from '@mui/x-data-grid-premium';

const styles: SxProps<Theme> = {
  background: '#fff',
  border: 0,
  boxShadow: 2,

  '.MuiDataGrid-columnSeparator': {
    display: 'none',
  },

  '.MuiDataGrid-columnHeaderTitleContainer': {
    padding: 0,
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
      {...props}
    />
  );
}
