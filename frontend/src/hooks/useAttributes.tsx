import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AttributeName, attributes } from '../config/attributes';

type Vals = Record<
  AttributeName,
  {
    min: string;
    target: string;
    max: string;
    minEnabled: boolean;
    targetEnabled: boolean;
    maxEnabled: boolean;
  }
>;

import { z } from 'zod';
import { AttributePreset } from '../config/presets';

const schema = z.object({
  min: z.coerce.number(),
  target: z.coerce.number(),
  max: z.coerce.number(),
  minEnabled: z.boolean(),
  targetEnabled: z.boolean(),
  maxEnabled: z.boolean(),
});

export function useAttributes() {
  const [searchParams, setSearchParams] = useSearchParams();

  const vals = useMemo(
    () =>
      attributes.reduce<Vals>((acc, attr) => {
        const minKey = `${attr.name}Min` as const;
        const targetKey = `${attr.name}Target` as const;
        const maxKey = `${attr.name}Max` as const;

        return {
          ...acc,
          [attr.name]: schema.parse({
            min: searchParams.get(minKey) ?? attr.defaultMin,
            target: searchParams.get(targetKey) ?? attr.defaultTarget,
            max: searchParams.get(maxKey) ?? attr.defaultMax,
            minEnabled: searchParams.has(minKey),
            targetEnabled: searchParams.has(targetKey),
            maxEnabled: searchParams.has(maxKey),
          }),
        };
      }, {} as Vals),
    [searchParams],
  );

  const [values, setValues] = useState<Vals>(vals);

  const applyPreset = (preset: AttributePreset) => {
    const draft: Vals = {};

    for (const attribute of attributes) {
      if (preset.attributes[attribute.name]) {
        draft[attribute.name] = preset.attributes[attribute.name];
      } else {
        draft[attribute.name] = {
          min: attribute.defaultMin,
          target: attribute.defaultTarget,
          max: attribute.defaultMax,
          minEnabled: false,
          maxEnabled: false,
          targetEnabled: false,
        };
      }
    }

    setValues(draft);
    commit(draft);
  };

  const updateAttribute = (
    name: AttributeName,
    data: {
      min: string;
      max: string;
      target: string;
      minEnabled: boolean;
      maxEnabled: boolean;
      targetEnabled: boolean;
    },
  ) => {
    setValues((v) => {
      const b = { ...v, [name]: data };
      commit(b);
      return b;
    });
  };

  const commit = (vals) => {
    setSearchParams((q) => {
      for (const [name, attrs] of Object.entries(vals)) {
        const minKey = `${name}Min` as const;
        const targetKey = `${name}Target` as const;
        const maxKey = `${name}Max` as const;

        if (attrs.minEnabled) {
          q.set(minKey, attrs.min);
        } else {
          q.delete(minKey);
        }
        if (attrs.targetEnabled) {
          q.set(targetKey, attrs.target);
        } else {
          q.delete(targetKey);
        }
        if (attrs.maxEnabled) {
          q.set(maxKey, attrs.max);
        } else {
          q.delete(maxKey);
        }
        console.log('q', name, attrs);
      }

      return q;
    });
  };

  return {
    values: vals,
    updateAttribute,
    attributes,
    applyPreset,
  };
}
