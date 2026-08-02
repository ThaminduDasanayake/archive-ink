import type { Metadata } from "next";
import "./globals.css";
// import { Providers } from "@/.vercel/Providers";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn("light", "font-sans", inter.variable)}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        {/*<Providers>{children}</Providers>*/}
        {children}
      </body>
    </html>
  );
}
