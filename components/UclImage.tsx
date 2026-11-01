"use client";

import { useState } from "react";

type Props = {
  src?: string;
  fallback?: string;
  alt: string;
  className?: string;
  shape?: "circle" | "contain";
};

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export default function UclImage({ src, fallback, alt, className = "h-10 w-10", shape = "contain" }: Props) {
  const [failed, setFailed] = useState<string[]>([]);
  const shapeClass = shape === "circle" ? "rounded-full object-cover object-top bg-surface2" : "object-contain";
  const current = [src, fallback].find((url) => url && !failed.includes(url));

  if (!current) {
    return (
      <span
        aria-label={alt}
        role="img"
        className={`${className} inline-flex shrink-0 items-center justify-center rounded-full bg-surface2 font-mono text-[10px] text-fore-muted`}
      >
        {initials(alt)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={current}
      src={current}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed((list) => [...list, current])}
      className={`${className} ${shapeClass} shrink-0`}
    />
  );
}
