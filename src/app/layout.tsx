import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "SPACESCOPE - Explore the Universe",
   description: "Discover space imagery, Mars rover photos, asteroid tracking, and more"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="text-white bg-gradient-to-b from-black via-gray-900 to-black ">

        <Header />
        <main className="min-h-screen ">
          {children}
        </main>
        <Footer/>
        </div>
      </body>
    </html>
  );
}
