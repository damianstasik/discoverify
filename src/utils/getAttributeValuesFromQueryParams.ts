import { attributes } from "../config/attributes";

export function getAttributeValuesFromQueryParams(qs: Record<string, string>) {
  return attributes.reduce((acc, attr) => {
    const minKey = `${attr.name}Min`;
    const targetKey = `${attr.name}Target`;
    const maxKey = `${attr.name}Max`;

    if (qs[minKey]) {
      acc[minKey] = qs[minKey];
    }

    if (qs[targetKey]) {
      acc[targetKey] = qs[targetKey];
    }

    if (qs[maxKey]) {
      acc[maxKey] = qs[maxKey];
    }

    return acc;
  }, {});
}
