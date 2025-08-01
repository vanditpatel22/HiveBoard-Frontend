import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HiveBoard",
  description: "HiveBoard is a platform for creating and managing your board",
  keywords: [
    "HiveBoard",
    "task management",
    "project management",
    "kanban board",
    "collaboration tool",
    "Trello alternative",
    "productivity",
    "teamwork",
    "to-do list",
    "workflow management",
    "kanban",
    "trello",
    "productivity",
    "teamwork",
    "to-do list",
  ],
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
        <Toaster />
        {children}
      </body>
    </html>
  );
}
