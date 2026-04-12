import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import { AppProviders } from "@/app/providers";
import "./globals.css";

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-inter",
});

const newsreader = Newsreader({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: {
    default: "Note Warehouse",
    template: "%s | Note Warehouse",
  },
  description:
    "A personal knowledge vault for storing, organizing, and searching Markdown notes.",
  openGraph: {
    description:
      "A personal knowledge vault for storing, organizing, and searching Markdown notes.",
    siteName: "Note Warehouse",
    title: "Note Warehouse",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
