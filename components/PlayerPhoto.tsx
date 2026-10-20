"use client";

import { useState } from "react";
import { playerPhotoUrl } from "@/data/players";

const sizes = {
  sm: "h-10 w-8",
  lg: "h-36 w-28 md:h-44 md:w-36",
};

export default function PlayerPhoto({ id, name, size = "sm" }: { id?: string; name: string; size?: keyof typeof sizes }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  if (!id || failed) {
    return (
      <span
        className={`${sizes[size]} inline-flex shrink-0 items-center justify-center rounded-md bg-surface2 font-mono text-xs text-fore-muted`}
        aria-hidden
      >
        {initials}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={playerPhotoUrl(id)}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${sizes[size]} shrink-0 rounded-md bg-white/90 object-cover object-top`}
    />
  );
}
