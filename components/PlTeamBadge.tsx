"use client";

import { useState } from "react";

export default function PlTeamBadge({ id, name, className = "h-7 w-7" }: { id?: string; name: string; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (!id || failed) {
    return (
      <span
        className={`${className} inline-flex shrink-0 items-center justify-center rounded-full bg-surface2 font-mono text-[10px] text-fore-muted`}
        aria-hidden
      >
        {name.slice(0, 3).toUpperCase()}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://resources.premierleague.com/premierleague/badges/50/t${id}.png`}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${className} shrink-0 object-contain`}
    />
  );
}
