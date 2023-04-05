import { useEffect, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Slider from '@radix-ui/react-slider';
import { mdiChevronDown, mdiClose } from '@mdi/js';
import { Icon } from './Icon';
import { Button } from './Button';
import { Switch } from './Switch';
import { tw } from '../tw';
import { Attribute, AttributeName } from '../config/attributes';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

interface Props {
  attribute: Attribute;
  onChange: (v: {
    min: string;
    target: string;
    max: string;
    minEnabled: boolean;
    targetEnabled: boolean;
    maxEnabled: boolean;
  }) => void;
  values: {
    min: string;
    target: string;
    max: string;
    minEnabled: boolean;
    targetEnabled: boolean;
    maxEnabled: boolean;
  };
}

export function RecommendationAttribute({
  attribute,
  onChange,
  values,
}: Props) {
  const [open, setOpen] = useState(false);

  const [minValue, setMin] = useState(values.min);
  const [targetValue, setTarget] = useState(values.target);
  const [maxValue, setMax] = useState(values.max);

  const [useMin, setUseMin] = useState(values.minEnabled);
  const [useTarget, setUseTarget] = useState(values.targetEnabled);
  const [useMax, setUseMax] = useState(values.maxEnabled);

  useEffect(() => {
    setMin(values.min);
    setTarget(values.target);
    setMax(values.max);
    setUseMin(values.minEnabled);
    setUseTarget(values.targetEnabled);
    setUseMax(values.maxEnabled);
  }, [values]);

  const { name, label, description, ...attr } = attribute;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          color={
            values.minEnabled || values.targetEnabled || values.maxEnabled
              ? 'primary'
              : undefined
          }
          className={tw(
            'text-sm rounded-xl border flex items-center h-6 px-2 active:bg-white/10 focus:outline-none focus:ring-2',
            values.minEnabled || values.targetEnabled || values.maxEnabled
              ? 'border-green-600 text-green-600 focus:ring-green-700'
              : 'border-slate-500 text-slate-300 focus:ring-slate-700',
          )}
          onClick={() => setOpen(true)}
          aria-describedby={name}
        >
          {label}
          <Icon
            path={mdiChevronDown}
            className={tw(
              's-4 ml-2 ',
              values.minEnabled || values.targetEnabled || values.maxEnabled
                ? 'text-green-600'
                : 'text-slate-450',
            )}
          />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="rounded-md p-3 w-96 bg-slate-500/70 backdrop-blur-xl"
          sideOffset={5}
          collisionPadding={10}
        >
          <h5 className="text-white font-medium">{label}</h5>

          <p className="py-3 text-slate-300 text-sm/relaxed">{description}</p>

          <h6 className="text-white text-sm mb-1">
            Minimum {label.toLowerCase()}
          </h6>

          <div className="flex items-center gap-3">
            <div>
              <Switch checked={useMin} onChange={(val) => setUseMin(val)} />
            </div>

            <div className="flex-1">
              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                value={[minValue]}
                min={attr.min ?? 0}
                max={attr.max ?? 1}
                step={typeof attr.step === 'undefined' ? 0.05 : attr.step}
                disabled={!useMin}
                onValueChange={(v) => setMin(v[0])}
              >
                <Slider.Track className="bg-white/25 relative grow rounded-full h-1">
                  <Slider.Range className="absolute bg-green-700 rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-5 h-5 bg-green-500 rounded-full hover:bg-violet3 focus:outline-none" />
              </Slider.Root>
            </div>
          </div>

          <h6 className="text-white text-sm mt-3 mb-1">
            Target {label.toLowerCase()}
          </h6>

          <div className="flex items-center gap-3">
            <div>
              <Switch
                checked={useTarget}
                onChange={(val) => setUseTarget(val)}
              />
            </div>
            <div className="flex-1">
              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                value={[targetValue]}
                min={attr.min ?? 0}
                max={attr.max ?? 1}
                step={typeof attr.step === 'undefined' ? 0.05 : attr.step}
                disabled={!useTarget}
                onValueChange={(v) => setTarget(v[0])}
              >
                <Slider.Track className="bg-white/25 relative grow rounded-full h-1">
                  <Slider.Range className="absolute bg-green-700 rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-5 h-5 bg-green-500 rounded-full hover:bg-violet3 focus:outline-none" />
              </Slider.Root>
            </div>
          </div>

          <h6 className="text-white text-sm mt-3 mb-1">
            Maximum {label.toLowerCase()}
          </h6>

          <div className="flex items-center gap-3">
            <div>
              <Switch checked={useMax} onChange={(val) => setUseMax(val)} />
            </div>
            <div className="flex-1">
              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                value={[maxValue]}
                min={attr.min ?? 0}
                max={attr.max ?? 1}
                step={typeof attr.step === 'undefined' ? 0.05 : attr.step}
                disabled={!useMax}
                onValueChange={(v) => setMax(v[0])}
              >
                <Slider.Track className="bg-white/25 relative grow rounded-full h-1">
                  <Slider.Range className="absolute bg-green-700 rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-5 h-5 bg-green-500 rounded-full hover:bg-violet3 focus:outline-none" />
              </Slider.Root>
            </div>
          </div>

          <Button
            onClick={() => {
              onChange({
                min: minValue,
                max: maxValue,
                target: targetValue,
                minEnabled: useMin,
                maxEnabled: useMax,
                targetEnabled: useTarget,
              });
              setOpen(false);
            }}
            className="mt-3"
          >
            Save
          </Button>
          <Popover.Close
            className="rounded-full h-8 w-8 p-1 inline-flex items-center justify-center text-slate-450 hover:text-slate-200 absolute top-2 right-2 hover:bg-white/10 outline-none"
            aria-label="Close"
          >
            <Icon path={mdiClose} />
          </Popover.Close>
          <Popover.Arrow className="fill-slate-500/70 backdrop-blur-xl" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
