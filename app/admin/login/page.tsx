"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError("Invalid credentials");
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 text-purple-100 flex items-center justify-center px-6 py-12">
      <section className="w-full max-w-sm rounded-2xl border border-purple-700/60 bg-purple-900/70 p-8 shadow-2xl shadow-purple-950/80 backdrop-blur-sm">
        <h1 className="text-center text-2xl font-bold tracking-wide text-purple-100">Admin Access</h1>

        {error && (
          <p className="mt-5 rounded-lg border border-red-500/60 bg-red-900/30 px-3 py-2 text-sm text-red-200">
            Invalid credentials
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-purple-200">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-lg border border-purple-700 bg-purple-950/70 px-3 py-2 text-purple-100 placeholder-purple-400/70 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-purple-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-purple-700 bg-purple-950/70 px-3 py-2 text-purple-100 placeholder-purple-400/70 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-500 px-4 py-2.5 font-semibold text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:bg-purple-700"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}
