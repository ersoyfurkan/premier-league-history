"use client";

import PlayerPhoto from "@/components/PlayerPhoto";
import UclImage from "@/components/UclImage";
import { clubLogoUrl } from "@/lib/uclPlayers";
import { espnBadge } from "@/lib/clubArt";

type Face = { id?: string; name: string; photo?: string; club?: string; clubId?: string };

// Premier League cards use the bundled cut-outs; Champions League cards carry their own UEFA photo and club
export default function CardFace({ card }: { card: Face }) {
  const laLiga = card.id?.startsWith("ll") ?? false;
  if (card.photo === undefined && !laLiga) return <PlayerPhoto id={card.id} name={card.name} size="lg" />;

  return (
    <div className="flex items-center gap-4">
      <UclImage src={card.photo} alt={card.name} shape="circle" className="h-28 w-28 md:h-36 md:w-36" />
      {card.club && (
        <span className="flex items-center gap-2 text-sm text-fore-muted md:text-base">
          <UclImage src={laLiga ? espnBadge(card.clubId ?? "") : clubLogoUrl(card.clubId ?? "")} alt={card.club} className="h-8 w-8" />
          {card.club}
        </span>
      )}
    </div>
  );
}
