"use client";

import { RecommendationAttribute } from "../../../components/RecommendationAttribute";
import { useAttributes } from "../../../hooks/useAttributes";

export function Attributes({ values }) {
  const attributes = useAttributes(values);
  return attributes.map((attr) => (
    <RecommendationAttribute key={attr.name} attr={attr} />
  ));
}
