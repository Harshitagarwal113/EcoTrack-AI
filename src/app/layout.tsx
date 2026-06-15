import type { Metadata } from "next";
import "material-symbols";
import "@/styles/globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { AuthProvider } from "@/features/auth/components/AuthProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "EcoTrack AI - Sustainable Intelligence",
  description: "Track and reduce your carbon footprint with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="text-on-background font-body-md antialiased min-h-screen flex flex-col transition-colors duration-300 bg-background overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
            <Analytics />
            <SpeedInsights />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
