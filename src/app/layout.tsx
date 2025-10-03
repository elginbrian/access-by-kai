import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/lib/providers/Providers";
import ChatShellClient from "@/components/global/ChatShellClient";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Access by KAI",
  description: "Sistem manajemen perkeretaapian yang komprehensif untuk Indonesia",
  icons: {
    icon: "/access_logo.png",
    shortcut: "/access_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div style={{ paddingRight: "var(--ai-sidebar-width, 0px)", transition: "padding-right 0.3s" }}>{children}</div>
          <ChatShellClient />
        </Providers>
      </body>
    </html>
  );
}
