import type { Metadata } from "next";
import { Geist, Geist_Mono, Doto } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SplashScreen } from "@/components/SplashScreen";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CryptoByte",
  description:
    "Web-based classical cryptography calculator: Vigenere, Affine, Playfair, Hill, and Enigma ciphers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${doto.variable} min-h-screen bg-white text-black antialiased`}
      >
        <SplashScreen />
        <Navbar />
        <main className="container mx-auto px-4 py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
