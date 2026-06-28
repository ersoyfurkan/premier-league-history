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
      <main className="min-h-screen bg-background text-foreground p-8 flex items-center justify-center grid-bg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 font-mono text-fore-muted uppercase tracking-[0.14em] text-xs">Loading...</p>
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
    <main className="min-h-screen bg-background text-foreground p-8 grid-bg">
      <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary hover:text-accent mb-8 inline-block">
        ← Home
      </Link>

      <div className="max-w-2xl mx-auto">
        <div className="data-card p-8 rounded-2xl scanline">
          {/* Header */}
          <div className="mb-8">
            <p className="section-eyebrow text-primary mb-1">Profile Channel</p>
            <h1 className="text-[clamp(36px,6vw,62px)] leading-[0.95] font-black mb-2 bg-[linear-gradient(135deg,#ffffff_30%,#00e5ff_100%)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
              Welcome, {user.username}
            </h1>
            <p className="text-fore-muted">Member since {formattedDate}</p>
          </div>

          {/* Favourite Club Section */}
          <div className="cyber-card mb-8">
            <h2 className="text-xl font-bold mb-4 text-primary">Favourite Club</h2>
            {favouriteClub ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold">{favouriteClub.name}</p>
                  <p className="text-fore-muted text-sm mt-1">{favouriteClub.stadium}</p>
                </div>
                <Link
                  href="/clubs"
                  className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary hover:text-accent"
                >
                  Change Favourite
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-fore-muted">No favourite club selected</p>
                <Link
                  href="/clubs"
                  className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary hover:text-accent inline-block mt-3"
                >
                  Choose a Favourite →
                </Link>
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="data-card p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 text-accent">Account Information</h2>
            <div className="space-y-3">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fore-muted">Email</p>
                <p className="font-semibold">{user.email}</p>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fore-muted">Username</p>
                <p className="font-semibold">{user.username}</p>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fore-muted">User ID</p>
                <p className="font-mono text-primary">#{user.id}</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full rounded-lg bg-danger/20 text-danger border border-danger/45 hover:bg-danger/30 disabled:opacity-60 disabled:cursor-not-allowed px-6 py-3 transition font-mono text-[12px] uppercase tracking-[0.1em]"
          >
            {isLoggingOut ? "Logging out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </main>
  );
}
