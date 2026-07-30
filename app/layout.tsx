import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Archive Ink - Personal Journaling & Habit Activity Tracker",
  description:
    "Capture daily thoughts and track writing habits with interactive multi-color annual heatmaps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0b0f19] text-gray-100 antialiased selection:bg-emerald-500 selection:text-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
