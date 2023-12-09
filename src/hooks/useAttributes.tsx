import { produce } from "immer";
import { attributes } from "../config/attributes";

export function useAttributes(values) {
  return attributes.map((attr) => {
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
      minEnabled: typeof values[minKey] !== "undefined",
      targetEnabled: typeof values[targetKey] !== "undefined",
      maxEnabled: typeof values[maxKey] !== "undefined",
      min: attr.min,
      max: attr.max,
      step: attr.step,
      onSave: (values) => {
        // setValues(
        //   produce((draft) => {
        //     if (values.min !== null) {
        //       draft[minKey] = values.min;
        //     } else {
        //       delete draft[minKey];
        //     }
        //     if (values.target !== null) {
        //       draft[targetKey] = values.target;
        //     } else {
        //       delete draft[targetKey];
        //     }
        //     if (values.target !== null) {
        //       draft[targetKey] = values.target;
        //     } else {
        //       delete draft[targetKey];
        //     }
        //   }),
        // );
        // const q = new URLSearchParams(searchParams);
        // if (values.min !== null) {
        //   q.set(minKey, values.min);
        // } else {
        //   q.delete(minKey);
        // }
        // if (values.target !== null) {
        //   q.set(targetKey, values.target);
        // } else {
        //   q.delete(targetKey);
        // }
        // if (values.max !== null) {
        //   q.set(maxKey, values.max);
        // } else {
        //   q.delete(maxKey);
        // }
        // setSearchParams(q);
      },
    };
  });
}
