import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AccountButton } from "@/components/account/account-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeProvider } from "@/components/theme-provider";

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
  title: "Safe QR Code generator",
  description: "Generate safe QR Code, without server gateway.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4 py-12 text-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50">
            <div className="absolute right-6 top-6 flex items-center gap-3">
              <ThemeToggle />
              <AccountButton />
            </div>
            <main className="flex flex-1 items-center justify-center pt-10">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
