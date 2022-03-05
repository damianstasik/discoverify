import { SxProps, Theme } from '@mui/material';
import { DataGridPro, DataGridProProps } from '@mui/x-data-grid-pro';

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

export function Table(props: DataGridProProps) {
  return (
    <DataGridPro
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
