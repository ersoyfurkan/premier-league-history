"use client";

import { useState } from "react";
import { playerPhotoUrl } from "@/data/players";

const sizes = {
  sm: "h-10 w-8",
  lg: "h-36 w-28 md:h-44 md:w-36",
};

// Cut-out photos (transparent background) are bundled in /public/players; players without one
// fall back to the Premier League photo, then to initials.
export default function PlayerPhoto({ id, name, size = "sm" }: { id?: string; name: string; size?: keyof typeof sizes }) {
  const [stage, setStage] = useState<"local" | "remote" | "none">("local");
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  if (!id || stage === "none") {
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
      key={stage}
      src={stage === "local" ? `/players/${id}.webp` : playerPhotoUrl(id)}
      alt={name}
      loading="lazy"
      onError={() => setStage(stage === "local" ? "remote" : "none")}
      className={`${sizes[size]} shrink-0 object-contain object-bottom`}
    />
  );
}
