import type { Metadata } from "next";
import { Syne, Space_Grotesk } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-syne",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "Groundwork — Verified Professionals for Nigerians Abroad",
  description: "Find verified home-service professionals in Lagos and Abuja. NIN verified, reference-checked, and portfolio-confirmed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black-pure selection:bg-white-pure selection:text-black-pure">
      <body className={`${syne.variable} ${spaceGrotesk.variable} font-body bg-black-pure text-white-pure antialiased overflow-x-hidden`}>
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}