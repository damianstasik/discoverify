import { Avatar, Stack, Typography } from '@mui/material';
import { memo } from 'react';

interface Props {
  name: string | undefined;
  artists: any[] | undefined;
  imageUrl: string | undefined;
}

export const TrackInfo = memo(({ name, artists, imageUrl }: Props) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar src={imageUrl} variant="rounded" sx={{ width: 56, height: 56 }} />
      <Stack>
        <Typography color="white" fontWeight={600}>
          {name}
        </Typography>
        <Typography>{artists?.map((a) => a.name).join(', ')}</Typography>
      </Stack>
    </Stack>
  );
});
