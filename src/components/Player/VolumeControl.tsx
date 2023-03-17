import { memo } from 'react';
import { mdiVolumeHigh, mdiVolumeLow } from '@mdi/js';
import { IconButton } from '../IconButton';
import * as Slider from '@radix-ui/react-slider';

interface Props {
  onChange: (value: number) => void;
  onCommit: (value: number) => void;
  volume: number;
}

export const VolumeControl = memo(({ volume, onCommit, onChange }: Props) => {
  const handleChange = (value: number[]) => onChange(value[0]);

  const handleChangeComitted = (value: number[]) => onCommit(value[0]);

  console.log('volume control render');

  return (
    <div className="flex gap-1 items-center">
      <IconButton icon={mdiVolumeLow} label="Volume down" />

      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[volume]}
        min={0}
        max={1}
        step={0.05}
        aria-label="Volume"
        onValueChange={handleChange}
        onValueCommit={handleChangeComitted}
      >
        <Slider.Track className="bg-white/25 relative grow rounded-full h-1">
          <Slider.Range className="absolute bg-green-500 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-5 h-5 bg-green-500 rounded-full hover:bg-violet3 focus:outline-none" />
      </Slider.Root>

      <IconButton icon={mdiVolumeHigh} label="Volume up" />
    </div>
  );
});
