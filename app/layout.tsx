import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Archive Ink - Personal Journaling & Habit Activity Tracker",
  description:
    "Capture daily thoughts and track writing habits with interactive multi-color annual heatmaps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
