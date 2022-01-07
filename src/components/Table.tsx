import { DataGridPro, DataGridProProps } from '@mui/x-data-grid-pro';

export function Table(props: DataGridProProps) {
  return (
    <DataGridPro
      sx={{
        background: '#fff',
        border: 0,
        boxShadow: 2,

        '.MuiDataGrid-columnSeparator': {
          display: 'none',
        },

        '.MuiDataGrid-columnHeaderTitleContainer': {
          padding: 0,
        },
      }}
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
