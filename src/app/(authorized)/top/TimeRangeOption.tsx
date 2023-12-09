"use client";

import { Icon } from "../../../components/Icon";
import mdiCheck from "@slimr/mdi-paths/Check";
import Link from "next/link";

import { tw } from "../../../tw";
import { useTimeRange } from "./useTimeRange";

export function TimeRangeOption({
  value,
  label,
  title,
}: { value: string; label: string; title?: string }) {
  const { timeRange, getTimeRangeUrl } = useTimeRange();

  const href = getTimeRangeUrl(value);
  const isActive = timeRange === value;

  return (
    <Link
      title={title}
      href={href}
      className={tw(
        " border rounded-md border-slate-500 px-2 py-2 leading-none flex cursor-pointer",
        isActive && "bg-white/5 text-white border-green-500",
      )}
    >
      <Icon
        path={mdiCheck}
        className={tw("hidden s-4 mr-2", isActive && "block text-green-500")}
      />
      {label}
    </Link>
  );
}
