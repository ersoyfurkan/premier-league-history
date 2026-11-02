"use client";

import PlayerPhoto from "@/components/PlayerPhoto";
import { playerFaceUrl } from "@/data/playerFaces";
import UclImage from "@/components/UclImage";
import { clubLogoUrl } from "@/lib/uclPlayers";
import { espnBadge } from "@/lib/clubArt";
import { NATION_INFO } from "@/data/nations";
import { natsOfPlayer } from "@/data/footballTicTacToe";

type Face = { id?: string; name: string; photo?: string; club?: string; clubId?: string };

// Premier League cards use the bundled cut-outs; Champions League cards carry their own UEFA photo and club
export default function CardFace({ card, nation = false }: { card: Face; nation?: boolean }) {
  const laLiga = (card.id && /^(ll|sa|bl|l1|sl)/.test(card.id)) ?? false;
  const country = nation ? NATION_INFO[natsOfPlayer(card.name)[0] ?? ""] : undefined;
  const flag = country && (
    <span className="flex items-center gap-2 text-sm text-fore-muted md:text-base">
      <UclImage src={`https://flagcdn.com/w80/${country[1]}.png`} alt={`${country[0]} flag`} className="h-5 w-8" />
      {country[0]}
    </span>
  );
  if (card.photo === undefined && !laLiga) {
    return (
      <div className="flex flex-col items-start gap-2">
        <PlayerPhoto id={card.id} name={card.name} size="lg" />
        {flag}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <UclImage src={card.photo} fallback={playerFaceUrl(card.name)} alt={card.name} shape="circle" className="h-28 w-28 md:h-36 md:w-36" />
      <div className="flex flex-col gap-2">
        {card.club && (
          <span className="flex items-center gap-2 text-sm text-fore-muted md:text-base">
            <UclImage src={laLiga ? espnBadge(card.clubId ?? "") : clubLogoUrl(card.clubId ?? "")} alt={card.club} className="h-8 w-8" />
            {card.club}
          </span>
        )}
        {flag}
      </div>
    </div>
  );
}
