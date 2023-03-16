import { Checkbox } from '@mui/material';
import { memo } from 'react';

export const CheckboxColumn = ({ onChange, checked, indeterminate }) => {
  return (
    <Checkbox
      checked={checked}
      indeterminate={indeterminate}
      onChange={onChange}
    />
  );
};
