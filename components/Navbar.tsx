"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LEAGUE_META, isEspnComp } from "@/lib/leagues";
import { TOURNAMENTS, tournamentForPath } from "@/lib/tournaments";

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  const inUcl = pathname.startsWith("/champions-league") || searchParams.get("comp") === "ucl";
  const compParam = searchParams.get("comp");
  const sectionComp = (Object.keys(LEAGUE_META) as (keyof typeof LEAGUE_META)[]).find(
    (key) => pathname === LEAGUE_META[key].home || pathname.startsWith(`${LEAGUE_META[key].home}/`) || (isEspnComp(compParam) && compParam === key),
  );
  const tournamentKey = tournamentForPath(pathname);
  const tournament = tournamentKey ? TOURNAMENTS[tournamentKey] : undefined;
  const links =
    pathname === "/"
      ? []
      : tournament
        ? [
            { href: "/", label: "Home" },
            { href: tournament.home, label: tournament.label },
            { href: tournament.game, label: "Game" },
          ]
        : sectionComp
        ? [
            { href: "/", label: "Home" },
            { href: LEAGUE_META[sectionComp].home, label: LEAGUE_META[sectionComp].label },
            { href: LEAGUE_META[sectionComp].game, label: "Game" },
          ]
        : inUcl
        ? [
            { href: "/", label: "Home" },
            { href: "/champions-league", label: "Champions League" },
            { href: "/champions-league/game", label: "Game" },
          ]
        : [
    { href: "/", label: "Home" },
    { href: "/clubs", label: "Clubs" },
    { href: "/seasons", label: "Seasons" },
    { href: "/rivalries", label: "Rivalries" },
    { href: "/game", label: "Game" },
  ];

  const isActive = (href: string) =>
    href === "/" || href === "/champions-league" || Object.values(LEAGUE_META).some((meta) => meta.home === href) || Object.values(TOURNAMENTS).some((meta) => meta.home === href)
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      aria-label="Main navigation"
      className="site-nav fixed inset-x-0 top-0 z-50 border-b border-[rgba(0,229,255,0.08)] bg-[rgba(3,4,10,0.85)] backdrop-blur-[20px]"
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          setIsOpen(false);
          menuButton.current?.focus();
        }
      }}
    >
      <div className="site-nav-inner max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" onClick={() => setIsOpen(false)} className="site-brand font-display text-xl tracking-[0.14em] uppercase text-primary drop-shadow-[0_0_14px_rgba(0,229,255,0.45)]">
            Football <span className="text-accent">History</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg border px-3 py-2 text-[12px] uppercase tracking-[0.1em] font-mono transition ${
                  isActive(link.href)
                    ? "text-primary bg-primary-dim border-[rgba(0,229,255,0.25)]"
                    : "text-fore-muted border-transparent hover:text-foreground hover:border-[rgba(255,255,255,0.15)]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Auth Links */}
            <div className="flex items-center gap-3 pl-4 ml-2 border-l border-border-dim">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className={`rounded-lg border px-3 py-2 text-[12px] uppercase tracking-[0.1em] font-mono transition ${
                      isActive("/profile")
                        ? "text-primary bg-primary-dim border-[rgba(0,229,255,0.25)]"
                        : "text-fore-muted border-transparent hover:text-foreground hover:border-[rgba(255,255,255,0.15)]"
                    }`}
                  >
                    {user.username}
                  </Link>
                  <button
                    onClick={async () => {
                      await logout();
                      router.push("/");
                    }}
                    className="btn-ghost"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className={`rounded-lg border px-3 py-2 text-[12px] uppercase tracking-[0.1em] font-mono transition ${
                      isActive("/auth/login")
                        ? "text-primary bg-primary-dim border-[rgba(0,229,255,0.25)]"
                        : "text-fore-muted border-transparent hover:text-foreground hover:border-[rgba(255,255,255,0.15)]"
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link href="/auth/register" className="btn-primary">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuButton}
            type="button"
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg border border-border-dim hover:border-border transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div id="mobile-navigation" className="mobile-navigation md:hidden mt-4 pb-4 space-y-3 border-t border-border-dim pt-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg transition font-mono text-[12px] tracking-[0.1em] uppercase border ${
                  isActive(link.href)
                    ? "text-primary bg-primary-dim border-[rgba(0,229,255,0.25)]"
                    : "text-fore-muted border-transparent hover:text-foreground hover:border-[rgba(255,255,255,0.15)]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Auth Links */}
            <div className="pt-3 mt-3 border-t border-border-dim space-y-3">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 rounded-lg transition font-mono text-[12px] tracking-[0.1em] uppercase border ${
                      isActive("/profile")
                        ? "text-primary bg-primary-dim border-[rgba(0,229,255,0.25)]"
                        : "text-fore-muted border-transparent hover:text-foreground hover:border-[rgba(255,255,255,0.15)]"
                    }`}
                  >
                    {user.username}
                  </Link>
                  <button
                    onClick={async () => {
                      setIsOpen(false);
                      await logout();
                      router.push("/");
                    }}
                    className="block w-full text-left px-4 py-2 rounded-lg bg-danger/20 text-danger border border-danger/50 hover:bg-danger/30 transition font-mono text-[12px] tracking-[0.1em] uppercase"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 rounded-lg transition font-mono text-[12px] tracking-[0.1em] uppercase border ${
                      isActive("/auth/login")
                        ? "text-primary bg-primary-dim border-[rgba(0,229,255,0.25)]"
                        : "text-fore-muted border-transparent hover:text-foreground hover:border-[rgba(255,255,255,0.15)]"
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary block text-center"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
