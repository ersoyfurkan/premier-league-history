"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json() as { error?: string };

      if (!response.ok) {
        setApiError(data.error || "Registration failed");
        return;
      }

      await refreshUser();
      router.push("/");
    } catch (error) {
      setApiError("An error occurred during registration");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-8 grid-bg relative overflow-hidden">
      <div className="glow-orb glow-orb-cyan w-[380px] h-[380px] top-12 -left-20" />
      <div className="glow-orb glow-orb-purple w-[420px] h-[420px] -bottom-24 -right-24" />
      <div className="max-w-md mx-auto mt-12 relative z-10">
        <div className="data-card rounded-2xl p-8 scanline">
          <p className="section-eyebrow text-accent text-center mb-2">Identity Provisioning</p>
          <h1 className="text-5xl leading-none font-black mb-8 text-center bg-[linear-gradient(135deg,#ffffff_30%,#a855f7_100%)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">Create Account</h1>

          {apiError && (
            <div className="bg-danger/15 border border-danger/45 text-danger px-4 py-3 rounded-lg mb-6 font-mono text-xs uppercase tracking-[0.1em]">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[0.14em] mb-2 text-primary">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                placeholder="Choose a username"
              />
              {errors.username && (
                <p className="text-red-400 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[0.14em] mb-2 text-primary">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[0.14em] mb-2 text-primary">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                placeholder="At least 8 characters"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[0.14em] mb-2 text-primary">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-fore-muted mt-6 text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-accent hover:text-primary font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
