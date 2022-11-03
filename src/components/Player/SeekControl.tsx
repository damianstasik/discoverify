import {
  Box,
  Slider,
  Stack,
  Typography,
  type SliderProps,
} from '@mui/material';
import { memo } from 'react';

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return [h, m > 9 ? m : h ? `0${m}` : m || '0', s > 9 ? s : `0${s}`]
    .filter(Boolean)
    .join(':');
}

interface Props {
  onChange: (value: number) => void;
  onCommit: (value: number) => void;
  position: number;
  duration: number;
}

export const SeekControl = memo(
  ({ position, duration, onChange, onCommit }: Props) => {
    const handleChange: SliderProps['onChange'] = (event, value) =>
      onChange(value);

    const handleChangeComitted: SliderProps['onChangeCommitted'] = (
      event,
      value,
    ) => onCommit(value);

    console.log('seek control render', duration);
    return (
      <Stack
        spacing={1}
        direction="column"
        alignItems="center"
        sx={{ width: '100%' }}
      >
        <Slider
          value={position}
          min={0}
          max={duration}
          step={1}
          onChange={handleChange}
          onChangeCommitted={handleChangeComitted}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: -1,
            width: '100%',
          }}
        >
          <Typography>{formatTime(position)}</Typography>
          <Typography>-{formatTime(duration - position)}</Typography>
        </Box>
      </Stack>
    );
  },
);
