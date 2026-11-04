import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { PanelContextProvider } from "@/components/panel-context";
import { NavigationLoadingProvider } from "@/components/navigation-loading-provider";
import { ResponsiveDebugProbe } from "@/components/responsive-debug-probe";
import { BRAND } from "@/config/branding";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-rkps-display",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "R.K. Memorial Public School | Portal",
  description:
    "School Management System for R.K. Memorial Public School — attendance, timetables, examinations, notices, and role-based portals for principals, teachers, and students.",
  icons: { icon: BRAND.logoSrc },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} antialiased`}
      >
        <AuthProvider>
          <PanelContextProvider>
            <NavigationLoadingProvider>
              <ResponsiveDebugProbe />
              {children}
            </NavigationLoadingProvider>
          </PanelContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
