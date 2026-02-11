import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PersistenceProvider } from "./components/PersistenceProvider";
import AchievementToast from "./components/AchievementToast";
import ConvexClientProvider from "./components/ConvexClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lineage Lit - Discover the Lineage of Ideas",
  description: "Track books, screenplays, and articles through their creative DNA. See where writers learned their craft.",
  openGraph: {
    title: "Lineage Lit - Discover the Lineage of Ideas",
    description: "Track books, screenplays, and articles through their creative DNA. See where writers learned their craft.",
    siteName: "Lineage Lit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lineage Lit - Discover the Lineage of Ideas",
    description: "Track books, screenplays, and articles through their creative DNA.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950`}
      >
        <ConvexClientProvider>
          <PersistenceProvider>
            <AchievementToast />
            {children}
          </PersistenceProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
