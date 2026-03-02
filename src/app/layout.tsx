import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CloudNotes - Capture your thoughts",
    template: "%s | CloudNotes",
  },
  description: "Capture thoughts, anywhere, anytime. CloudNotes is a smart cloud note app supporting AI-powered search and end-to-end encryption.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "CloudNotes - Capture your thoughts",
    description: "Capture thoughts, anywhere, anytime.",
    url: "/",
    siteName: "CloudNotes",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CloudNote Preview Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CloudNotes - Capture your thoughts",
    description: "Capture thoughts, anywhere, anytime.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
