"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { clubs } from "@/data/clubs";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-purple-950 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          <p className="mt-4 text-purple-300">Loading...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const favouriteClub = user.favouriteClubId
    ? clubs.find((c) => c.id === user.favouriteClubId)
    : null;

  const memberSince = new Date(user.created_at);
  const formattedDate = memberSince.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-purple-950 text-white p-8">
      <Link href="/" className="text-purple-300 hover:text-purple-200 mb-8 inline-block">
        ← Home
      </Link>

      <div className="max-w-2xl mx-auto">
        <div className="bg-purple-900 rounded-xl p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome, {user.username}!</h1>
            <p className="text-purple-300">Member since {formattedDate}</p>
          </div>

          {/* Favourite Club Section */}
          <div className="bg-purple-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 text-purple-200">Favourite Club</h2>
            {favouriteClub ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold">{favouriteClub.name}</p>
                  <p className="text-purple-400 text-sm mt-1">{favouriteClub.stadium}</p>
                </div>
                <Link
                  href="/clubs"
                  className="text-purple-300 hover:text-purple-200 font-semibold text-sm"
                >
                  Change Favourite
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-purple-400">No favourite club selected</p>
                <Link
                  href="/clubs"
                  className="text-purple-400 hover:text-purple-300 font-semibold inline-block mt-3"
                >
                  Choose a Favourite →
                </Link>
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="bg-purple-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 text-purple-200">Account Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-purple-400 text-sm">Email</p>
                <p className="font-semibold">{user.email}</p>
              </div>
              <div>
                <p className="text-purple-400 text-sm">Username</p>
                <p className="font-semibold">{user.username}</p>
              </div>
              <div>
                <p className="text-purple-400 text-sm">User ID</p>
                <p className="font-semibold">#{user.id}</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition"
          >
            {isLoggingOut ? "Logging out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </main>
  );
}
