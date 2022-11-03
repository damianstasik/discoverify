import { IconButton, Slider, Stack, type SliderProps } from '@mui/material';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import { memo } from 'react';

interface Props {
  onChange: (value: number) => void;
  onCommit: (value: number) => void;
  volume: number;
}

export const VolumeControl = memo(({ volume, onCommit, onChange }: Props) => {
  const handleChange: SliderProps['onChange'] = (event, value) =>
    onChange(value);

  const handleChangeComitted: SliderProps['onChangeCommitted'] = (
    event,
    value,
  ) => onCommit(value);

  console.log('volume control render');

  return (
    <Stack spacing={1} direction="row" alignItems="center">
      <IconButton aria-label="delete">
        <VolumeDown />
      </IconButton>

      <Slider
        aria-label="Volume"
        onChangeCommitted={handleChangeComitted}
        onChange={handleChange}
        value={volume}
        min={0}
        max={1}
        step={0.05}
      />
      <IconButton aria-label="delete">
        <VolumeUp />
      </IconButton>
    </Stack>
  );
});
