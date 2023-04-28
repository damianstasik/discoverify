import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { produce } from 'immer';

export function useAttributes(config: Record<string, any>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [values, setValues] = useState(
    config.reduce((acc, attr) => {
      const minKey = `${attr.name}Min`;
      const targetKey = `${attr.name}Target`;
      const maxKey = `${attr.name}Max`;

      if (searchParams.has(minKey)) {
        acc[minKey] = searchParams.get(minKey);
      }

      if (searchParams.has(targetKey)) {
        acc[targetKey] = searchParams.get(targetKey);
      }

      if (searchParams.has(maxKey)) {
        acc[maxKey] = searchParams.get(maxKey);
      }

      return acc;
    }, {})
  );

  return {
    values,
    attributes: config.map((attr) => {
      const minKey = `${attr.name}Min`;
      const targetKey = `${attr.name}Target`;
      const maxKey = `${attr.name}Max`;

      return {
        name: attr.name,
        label: attr.label,
        marks: attr.marks,
        description: attr.description,
        minValue: values[minKey] ?? attr.defaultMin,
        targetValue: values[targetKey] ?? attr.defaultTarget,
        maxValue: values[maxKey] ?? attr.defaultMax,
        minEnabled: searchParams.has(minKey),
        targetEnabled: searchParams.has(targetKey),
        maxEnabled: searchParams.has(maxKey),
        min: attr.min,
        max: attr.max,
        step: attr.step,
        onSave: (values) => {
          setValues(
            produce((draft) => {
              if (values.min !== null) {
                draft[minKey] = values.min;
              } else {
                delete draft[minKey];
              }
              if (values.target !== null) {
                draft[targetKey] = values.target;
              } else {
                delete draft[targetKey];
              }
              if (values.target !== null) {
                draft[targetKey] = values.target;
              } else {
                delete draft[targetKey];
              }
            })
          );

          const q = new URLSearchParams(searchParams);
          if (values.min !== null) {
            q.set(minKey, values.min);
          } else {
            q.delete(minKey);
          }
          if (values.target !== null) {
            q.set(targetKey, values.target);
          } else {
            q.delete(targetKey);
          }
          if (values.max !== null) {
            q.set(maxKey, values.max);
          } else {
            q.delete(maxKey);
          }

          setSearchParams(q);
        },
      };
    }),
  };
}
