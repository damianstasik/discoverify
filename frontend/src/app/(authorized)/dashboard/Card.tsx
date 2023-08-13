import { tw } from "../../../tw";

interface Props {
  children: React.ReactNode;
  className?: string;
  title: string;
}

export function Card({ children, className, title }: Props) {
  return (
    <div className={tw("px-3 py-2 bg-slate-700 rounded-md", className)}>
      <h5 className="text-base font-semibold text-white">{title}</h5>
      {children}
    </div>
  );
}
