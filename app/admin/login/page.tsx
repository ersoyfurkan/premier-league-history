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
    <main className="min-h-screen bg-background text-foreground grid-bg flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="glow-orb glow-orb-cyan w-[420px] h-[420px] -top-16 -left-16" />
      <div className="glow-orb glow-orb-purple w-[420px] h-[420px] -bottom-24 -right-20" />
      <section className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-surface/85 p-8 shadow-glow-card backdrop-blur-md scanline">
        <p className="section-eyebrow text-primary text-center mb-2">Restricted Layer</p>
        <h1 className="text-center text-[44px] leading-none font-black tracking-wide bg-[linear-gradient(135deg,#ffffff_25%,#00e5ff_65%,#a855f7_100%)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">Admin Access</h1>

        {error && (
          <p className="mt-5 rounded-lg border border-danger/60 bg-danger/20 px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-danger">
            Invalid credentials
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="username" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-primary">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-lg border border-border bg-muted px-3 py-3 text-foreground placeholder-fore-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-primary">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-border bg-muted px-3 py-3 text-foreground placeholder-fore-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}
