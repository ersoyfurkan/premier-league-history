import Link from "next/link";
import { FORMATION_PLAYERS, formationPortrait } from "@/data/formationInvasion";
import { playerFaceUrl } from "@/data/playerFaces";

export const metadata = { title: "Formation Invasion - Image licences" };

export default function FormationImageLicences() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 text-foreground">
      <Link href="/game/formation-invasion?comp=general" className="btn-ghost">Back to Formation Invasion</Link>
      <h1 className="mt-6 text-3xl font-bold">Formation Invasion image licences</h1>
      <p className="mt-4 text-sm leading-6 text-fore-muted">
        Player portraits are displayed unchanged apart from resizing and a circular display crop.
        Wikimedia Commons file pages identify the photographer, original work and applicable licence.
        Where a fallback portrait is available, both sources are listed. Initials are shown when an image cannot load.
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {FORMATION_PLAYERS.map((player) => {
          const photos = [...new Set([playerFaceUrl(player.name), formationPortrait(player.id)].filter((photo) => photo !== undefined))];
          return (
            <li key={player.id} className="rounded-xl border border-border p-4">
              <h2 className="font-bold">{player.name}</h2>
              {photos.map((photo, index) => {
                const file = photo.split("/").at(photo.includes("/thumb/") ? -2 : -1);
                const credit = photo.includes("wikimedia.org")
                  ? `https://commons.wikimedia.org/wiki/File:${file}` : photo;
                return (
                  <a key={photo} href={credit} target="_blank" rel="noopener noreferrer"
                    className="mt-2 block text-sm text-primary underline">
                    {index === 0 ? "Portrait" : "Fallback portrait"}: creator, original and licence
                  </a>
                );
              })}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
