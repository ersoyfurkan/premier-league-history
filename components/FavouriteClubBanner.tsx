"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { clubs } from "@/data/clubs";

export default function FavouriteClubBanner() {
  const { user } = useAuth();

  if (!user || !user.favouriteClubId) {
    return null;
  }

  const club = clubs.find((c) => c.id === user.favouriteClubId);

  if (!club) {
    return null;
  }

  return (
    <Link href={`/clubs/${club.id}`}>
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-purple-950 px-6 py-4 rounded-lg font-semibold hover:from-yellow-400 hover:to-yellow-500 transition cursor-pointer">
        <div className="flex items-center justify-between">
          <span>
            Your club: <span className="font-bold">{club.name}</span> — {club.titles} Premier League{" "}
            {club.titles === 1 ? "title" : "titles"}
          </span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
