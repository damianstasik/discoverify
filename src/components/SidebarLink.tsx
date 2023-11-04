"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tw } from "../tw";
import { Icon } from "./Icon";

export function SidebarLink({
  to,
  label,
  icon,
  className,
  iconTintColor,
  textTintColor,
  state,
}: any) {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <Link
      href={to}
      className={tw(
        isActive
          ? "bg-slate-800 text-white border-slate-775"
          : "text-slate-400 hover:bg-slate-700 hover:border-t-slate-675 hover:text-white border-t-transparent",
        "group flex items-center h-8 px-2 text-sm rounded-md border-t",
        className,
        textTintColor,
      )}
      title={label}
      // state={state}
    >
      {icon && (
        <Icon
          path={icon}
          className={tw(
            isActive
              ? "text-slate-300"
              : "text-slate-500 group-hover:text-slate-300",
            "mr-2 flex-shrink-0 h-5 w-5",
            iconTintColor,
          )}
          aria-hidden="true"
        />
      )}
      <span className="truncate">{label}</span>
    </Link>
  );
}
