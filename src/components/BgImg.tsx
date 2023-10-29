"use client";
import { useState } from "react";
import { tw } from "../tw";
import Image from "next/image";

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
      <Image
        src={src}
        alt={alt}
        sizes="500px"
        fill
        className="object-cover w-full h-full -z-10"
        onLoadingComplete={() => setLoaded(true)}
      />
    </div>
  );
}
