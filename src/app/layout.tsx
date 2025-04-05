import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import swrConfig from "@/config/swr";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SWRConfig } from "swr";
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
  title: "TestackAI - Knowledge Base Manager",
  description: "Manage your knowledge base connecting to providers like Google Drive, OneDrive, Notion and more.",
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
        <TooltipProvider>
          <SWRConfig value={swrConfig}>
            {children}
            <Toaster />
          </SWRConfig>
        </TooltipProvider>
      </body>
    </html>
  );
}
