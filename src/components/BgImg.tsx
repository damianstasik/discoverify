"use client";
import { useState } from "react";
import { tw } from "../tw";

interface Props {
  src?: string;
  alt: string;
  className?: string;
}

export function BgImg({ src, className, alt }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={tw(
        "absolute top-0 inset-x-0 z-0 h-[500px] opacity-0 transition-opacity duration-500",
        loaded && "opacity-20",
        className,
      )}
    >
      <span className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-slate-900" />
      <img
        src={src}
        alt={alt}
        className="object-cover w-full h-full"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
