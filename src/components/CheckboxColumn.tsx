import { Checkbox } from '@mui/material';
import { memo } from 'react';

export const CheckboxColumn = memo(({ isRow, table, row }) => {
  if (isRow) {
    return (
      <Checkbox
        checked={row.getIsSelected()}
        indeterminate={row.getIsSomeSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    );
  }
  return (
    <Checkbox
      checked={table.getIsAllRowsSelected()}
      indeterminate={table.getIsSomeRowsSelected()}
      onChange={table.getToggleAllRowsSelectedHandler()}
    />
  );
});
