import "@/styles/globals.css";
import type React from "react"
import { type Metadata } from "next";
import { Poppins } from "next/font/google";
import { I18nProvider } from "./i18n-provider";
import {FloatingMenuButton } from "@/components/floating-menu-button"
import { TRPCReactProvider } from "@/trpc/react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  fallback: ["sans-serif"],
});

export const metadata: Metadata = {
  title: "AquaguardAI - Smart Agriculture & Automation",
  description: "Transform your farm with AI-driven irrigation and automation. Save 30% water while increasing yields by 25%. Smart agriculture solutions for modern farming.",
  keywords: "smart agriculture, irrigation automation, farm technology, water conservation, crop optimization, AI farming",
  authors: [{ name: "AquaguardAI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aquaguardai.com",
    title: "AquaguardAI - Smart Agriculture & Automation",
    description: "Transform your farm with AI-driven irrigation and automation. Save 30% water while increasing yields by 25%.",
    siteName: "AquaguardAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "AquaguardAI - Smart Agriculture & Automation",
    description: "Transform your farm with AI-driven irrigation and automation. Save 30% water while increasing yields by 25%.",
  },
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/apple-touch-icon.png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <TRPCReactProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
