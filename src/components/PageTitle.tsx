import { type SxProps, type Theme, Typography } from '@mui/material';
import { type ReactNode } from 'react';

const styles: SxProps<Theme> = {
  mb: 3,
  color: '#fff',
  fontWeight: 600,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

interface Props {
  children: ReactNode;
}

export function PageTitle({ children }: Props) {
  return (
    <Typography variant="h4" sx={styles}>
      {children}
    </Typography>
  );
}
