import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./auth/Provider";
import { Toaster } from "sonner";
import { SITE_CONFIG } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`, // %s will be replaced by the page title
  },
  // Global defaults
  openGraph: {
    siteName: SITE_CONFIG.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Put the Leaflet CSS here */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster
            toastOptions={{
              // className: "rounded-2xl border-zinc-200 shadow-lg", // Match your gallery rounded corners
              actionButtonStyle: {
                backgroundColor: "blue", // zinc-900 (Black)
                borderRadius: "9999px", // Pill shape
              },
              cancelButtonStyle: {
                backgroundColor: "transparent",
                color: "#71717a", // zinc-500
              },
            }}
            position="top-right"
            richColors
          />
        </AuthProvider>
      </body>
    </html>
  );
}
