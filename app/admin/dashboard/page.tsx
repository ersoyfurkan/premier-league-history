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

    const loadData = async () => {
      setLoading(true);

      try {
        const [statsResponse, usersResponse] = await Promise.all([
          fetch("/api/admin/stats", { method: "GET" }),
          fetch("/api/admin/users", { method: "GET" }),
        ]);

        if (statsResponse.status === 401 || usersResponse.status === 401) {
          router.replace("/admin/login");
          return;
        }

        if (!statsResponse.ok || !usersResponse.ok) {
          return;
        }

        const [statsData, usersData] = (await Promise.all([
          statsResponse.json(),
          usersResponse.json(),
        ])) as [StatsResponse, AdminUser[]];

        if (!active) {
          return;
        }

        setStats(statsData);
        setUsers(usersData);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      active = false;
    };
  }, [router]);

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

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 px-6 py-10 text-purple-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-wide">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-purple-500 bg-purple-800 px-4 py-2 font-semibold text-purple-100 transition hover:bg-purple-700"
          >
            Logout
          </button>
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-purple-700 bg-purple-900/60 p-5">
            <p className="text-sm text-purple-300">Total Users</p>
            <p className="mt-2 text-3xl font-bold">{stats?.totalUsers ?? 0}</p>
          </div>
          <div className="rounded-xl border border-purple-700 bg-purple-900/60 p-5">
            <p className="text-sm text-purple-300">Total Favourites</p>
            <p className="mt-2 text-3xl font-bold">{stats?.totalFavourites ?? 0}</p>
          </div>
          <div className="rounded-xl border border-purple-700 bg-purple-900/60 p-5">
            <p className="text-sm text-purple-300">Top Club</p>
            <p className="mt-2 text-2xl font-bold">{topClubName}</p>
          </div>
        </section>

        <section className="overflow-x-auto rounded-xl border border-purple-700 bg-purple-900/40">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-purple-800/80 text-purple-200">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Favourite Club</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-purple-300">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-purple-300">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className={index % 2 === 0 ? "bg-purple-950/30" : "bg-purple-900/30"}
                  >
                    <td className="px-4 py-3">{user.id}</td>
                    <td className="px-4 py-3">{user.username}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {user.favouriteClubId
                        ? clubMap.get(user.favouriteClubId) ?? user.favouriteClubId
                        : "None"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={deletingUserId === user.id}
                        className="rounded-md bg-red-600 px-3 py-1.5 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-800"
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
