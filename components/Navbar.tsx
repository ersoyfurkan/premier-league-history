"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/clubs", label: "Clubs" },
    { href: "/seasons", label: "Seasons" },
    { href: "/rivalries", label: "Rivalries" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-purple-900 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-purple-200">
            PL History
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition font-semibold ${
                  isActive(link.href)
                    ? "text-purple-300 border-b-2 border-purple-300 pb-1"
                    : "text-purple-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Auth Links */}
            <div className="flex items-center gap-4 pl-4 border-l border-purple-700">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className={`transition font-semibold ${
                      isActive("/profile")
                        ? "text-purple-300 border-b-2 border-purple-300 pb-1"
                        : "text-purple-300 hover:text-white"
                    }`}
                  >
                    {user.username}
                  </Link>
                  <button
                    onClick={async () => {
                      await logout();
                      router.push("/");
                    }}
                    className="text-purple-300 hover:text-white transition font-semibold"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className={`transition font-semibold ${
                      isActive("/auth/login")
                        ? "text-purple-300 border-b-2 border-purple-300 pb-1"
                        : "text-purple-300 hover:text-white"
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg transition font-semibold"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-purple-800 rounded-lg transition"
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
          <div className="md:hidden mt-4 pb-4 space-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg transition font-semibold ${
                  isActive(link.href)
                    ? "bg-purple-700 text-purple-200"
                    : "text-purple-300 hover:bg-purple-800"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Auth Links */}
            <div className="pt-3 mt-3 border-t border-purple-700 space-y-3">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 rounded-lg transition font-semibold ${
                      isActive("/profile")
                        ? "bg-purple-700 text-purple-200"
                        : "text-purple-300 hover:bg-purple-800"
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
                    className="block w-full text-left px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition font-semibold"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 rounded-lg transition font-semibold ${
                      isActive("/auth/login")
                        ? "bg-purple-700 text-purple-200"
                        : "text-purple-300 hover:bg-purple-800"
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition font-semibold"
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
