import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/lib/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IPOG Admin Panel",
  description: "Admin panel for IPOG - IPO Management Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
