"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clubs } from "@/data/clubs";

type StatsResponse = {
  totalUsers: number;
  totalFavourites: number;
  topClubs: Array<{ club_id: string; count: number }>;
};

type AdminUser = {
  id: number;
  username: string;
  email: string;
  created_at: string;
  favouriteClubId: string | null;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  const clubMap = useMemo(() => {
    return new Map(clubs.map((club) => [club.id, club.name]));
  }, []);

  const fetchUsers = useCallback(async () => {
    const response = await fetch("/api/admin/users", { method: "GET" });

    if (response.status === 401) {
      router.replace("/admin/login");
      return;
    }

    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as AdminUser[];
    setUsers(data);
  }, [router]);

  useEffect(() => {
    let active = true;

    fetch("/api/admin/stats", { method: "GET" })
      .then(async (res) => {
        if (res.status === 401) {
          if (active) {
            setUnauthorized(true);
          }
          return;
        }

        if (!res.ok) {
          return;
        }

        if (active) {
          setAuthed(true);
        }

        const statsData = (await res.json()) as StatsResponse;
        if (active) {
          setStats(statsData);
        }

        const usersResponse = await fetch("/api/admin/users", { method: "GET" });

        if (usersResponse.status === 401) {
          if (active) {
            setAuthed(false);
            setUnauthorized(true);
          }
          return;
        }

        if (!usersResponse.ok) {
          return;
        }

        const usersData = (await usersResponse.json()) as AdminUser[];
        if (active) {
          setUsers(usersData);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!loading && unauthorized) {
      router.push("/admin/login");
    }
  }, [loading, unauthorized, router]);

  const handleDelete = async (userId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) {
      return;
    }

    setDeletingUserId(userId);

    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }

      if (!response.ok) {
        return;
      }

      await fetchUsers();
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  const topClub = stats?.topClubs?.[0];
  const topClubName = topClub ? clubMap.get(topClub.club_id) ?? topClub.club_id : "None";

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground grid-bg flex items-center justify-center">
        <div className="font-mono text-xs uppercase tracking-[0.14em] text-primary">Loading...</div>
      </div>
    );
  }

  if (!authed) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background grid-bg px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="section-eyebrow text-primary mb-1">Command Layer</p>
            <h1 className="text-[clamp(38px,6vw,68px)] leading-[0.95] font-black bg-[linear-gradient(135deg,#ffffff_20%,#00e5ff_60%,#a855f7_100%)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
              Admin Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="btn-ghost"
          >
            Logout
          </button>
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-primary/25 bg-primary-dim p-5 shadow-glow-card">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary">Total Users</p>
            <p className="mt-2 font-display text-4xl text-primary stat-number">{stats?.totalUsers ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-accent/30 bg-accent-dim p-5 shadow-glow-purple">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">Total Favourites</p>
            <p className="mt-2 font-display text-4xl text-accent">{stats?.totalFavourites ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-secondary/40 bg-secondary/15 p-5 shadow-glow-card">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">Top Club</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{topClubName}</p>
          </div>
        </section>

        <section className="overflow-x-auto data-card">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface2 text-primary">
              <tr>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em]">ID</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em]">Username</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em]">Email</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em]">Joined</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em]">Favourite Club</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-fore-muted">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className={index % 2 === 0 ? "bg-primary/2 hover:bg-primary/5" : "bg-transparent hover:bg-primary/5"}
                  >
                    <td className="px-4 py-3 font-mono text-primary">{user.id}</td>
                    <td className="px-4 py-3">{user.username}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3 font-mono text-fore-muted">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {user.favouriteClubId
                        ? clubMap.get(user.favouriteClubId) ?? user.favouriteClubId
                        : "None"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={deletingUserId === user.id}
                        className="rounded-md border border-danger/45 bg-danger/20 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-danger transition hover:bg-danger/30 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingUserId === user.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
