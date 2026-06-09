import type { Metadata, Viewport } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://wedding-rika-dan-dani.vercel.app')
  ),
  title: "Undangan Pernikahan Dani & Rika",
  description: "Undangan Pernikahan Digital Dani Ramdani & Rika Rahmawati. Hari Minggu, 14 Juni 2026 di Desa Pasarean, Pamijahan, Bogor.",
  keywords: ["Dani & Rika", "Undangan Pernikahan", "Dani Ramdani", "Rika Rahmawati", "Undangan Digital"],
  authors: [{ name: "Dani & Rika" }],
  openGraph: {
    title: "Undangan Pernikahan Dani & Rika",
    description: "Undangan Pernikahan Digital Dani Ramdani & Rika Rahmawati. Hari Minggu, 14 Juni 2026 di Desa Pasarean, Pamijahan, Bogor.",
    type: "website",
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
    <html
      lang="id"
      className={`${playfair.variable} ${outfit.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full font-sans antialiased text-slate-800 bg-white">
        {children}
      </body>
    </html>
  );
}
