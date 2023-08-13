"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "../../../../components/Icon";
import { tw } from "../../../../tw";

export function TabLink({ tab }) {
  const pathname = usePathname();
  const isCurrent = pathname === tab.to;

  return (
    <Link
      href={tab.to}
      className={tw(
        isCurrent
          ? "border-green-500 text-green-600"
          : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-400",
        "group inline-flex items-center py-2 px-1 border-b-2 text-sm",
      )}
      aria-current={isCurrent ? "page" : undefined}
    >
      <Icon
        path={tab.icon}
        className={tw(
          isCurrent
            ? "text-green-500"
            : "text-slate-450 group-hover:text-slate-400",
          "mr-2 s-4",
        )}
        aria-hidden="true"
      />
      <span>{tab.label}</span>
    </Link>
  );
}
