import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Football History Archive",
  description: "Explore Premier League and UEFA Champions League stats, seasons, and history.",
};

export const viewport: Viewport = {
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <AuthProvider>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <div className="site-content pt-20">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
