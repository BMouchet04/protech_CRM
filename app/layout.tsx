import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUKE CRM — Prospects",
  description: "Prototype de la page Prospects de LUKE CRM pour ProTech Monte-Carlo.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
