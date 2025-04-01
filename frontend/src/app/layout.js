"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const showHeader = pathname === "/memories" || pathname === "/visualization";

  return (
    <html lang="en" className={inter.className}>
      <body>
        {showHeader && (
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 relative flex items-center">
              <Link
                href="/"
                className="text-gray-800 hover:text-gray-600 transition-colors absolute left-0"
              >
                ← Back to Homepage
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 w-full text-center">
                Memories Database
              </h1>
            </div>
          </header>
        )}
        {children}
      </body>
    </html>
  );
}
