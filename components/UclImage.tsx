"use client";

import { useState } from "react";

type Props = {
  src?: string;
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

export default function UclImage({ src, alt, className = "h-10 w-10", shape = "contain" }: Props) {
  const [failed, setFailed] = useState(false);
  const shapeClass = shape === "circle" ? "rounded-full object-cover object-top bg-surface2" : "object-contain";

  if (!src || failed) {
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
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`${className} ${shapeClass} shrink-0`}
    />
  );
}
