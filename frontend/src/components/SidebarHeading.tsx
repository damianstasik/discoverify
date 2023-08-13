import { tw } from "../tw";

export function SidebarHeading({
  children,
  className,
  separatorClassName,
}: any) {
  return (
    <div className={tw("flex items-center px-2", className)}>
      <span className="flex-shrink pr-3 font-semibold text-sm text-white">
        {children}
      </span>
      <div
        className={tw(
          "flex-grow h-px bg-gradient-to-r to-transparent",
          separatorClassName,
        )}
        aria-hidden="true"
      />
    </div>
  );
}
