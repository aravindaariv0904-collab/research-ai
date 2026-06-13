import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NEXUS — AI Research Operating System",
  description: "A premium, production-grade AI-powered research platform. Verify claims, detect contradictions, build knowledge graphs, and forecast market/technology outlooks using Context.dev and Gemini.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className={`${inter.className} min-h-screen text-slate-100 flex flex-col relative`}>
        {/* Animated mesh backdrop */}
        <div className="bg-mesh-glow" />
        {children}
      </body>
    </html>
  );
}
