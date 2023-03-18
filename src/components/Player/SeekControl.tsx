import { memo } from 'react';
import * as Slider from '@radix-ui/react-slider';

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
    const handleChange = (value: number[]) => onChange(value[0]);

    const handleChangeComitted = (value: number[]) => onCommit(value[0]);

    console.log('seek control render', duration);
    return (
      <div className="flex flex-col gap-1 w-full items-center">
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          value={[position]}
          min={0}
          max={duration}
          step={1}
          aria-label="Position"
          onValueChange={handleChange}
          onValueCommit={handleChangeComitted}
        >
          <Slider.Track className="bg-neutral-700 relative grow rounded-full h-1">
            <Slider.Range className="absolute bg-green-700 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-5 h-5 bg-green-500 rounded-full hover:bg-violet3 focus:outline-none" />
        </Slider.Root>

        <div className="flex items-center justify-between w-full text-neutral-400 text-sm pointer-events-none tabular-nums">
          <span>{formatTime(position)}</span>
          <span>-{formatTime(duration - position)}</span>
        </div>
      </div>
    );
  },
);
