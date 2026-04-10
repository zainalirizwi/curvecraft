import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";

export const metadata: Metadata = {
  title: "CurveCraft — Academic GPA Calculator",
  description:
    "Exact GPA/CGPA calculation, relative grade prediction, what-if simulation, and custom grading scales — designed for university students.",
  authors: [{ name: "Zain Ali Rizvi" }],
  keywords: [
    "CGPA calculator",
    "GPA calculator",
    "relative grading",
    "grade predictor",
    "university grades",
    "Pakistan HEC grading",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Do NOT set maximumScale or userScalable — we respect the user's zoom preference
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
