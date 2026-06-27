"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface FavouriteButtonProps {
  clubId: string;
  clubName: string;
}

export default function FavouriteButton({ clubId, clubName }: FavouriteButtonProps) {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const isFavourite = user?.favouriteClubId === clubId;

  const handleFavourite = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch("/api/user/favourite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubId }),
      });

      if (response.ok) {
        await refreshUser();
      }
    } catch (error) {
      console.error("Failed to update favourite:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg font-semibold transition text-sm"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
        Login to favourite
      </Link>
    );
  }

  return (
    <button
      onClick={handleFavourite}
      disabled={loading}
      className="inline-flex items-center justify-center p-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      title={isFavourite ? `Remove ${clubName} from favourites` : `Add ${clubName} to favourites`}
    >
      <svg
        className={`w-6 h-6 transition ${
          isFavourite ? "fill-yellow-400 text-yellow-400" : "text-purple-300 hover:text-yellow-400"
        }`}
        fill={isFavourite ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={isFavourite ? 0 : 2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
      </svg>
    </button>
  );
}
