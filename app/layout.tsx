import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";

const SITE_URL = "https://www.gradeforge.site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GradeForge — UCP, UMT, UOL CGPA & GPA Calculator Pakistan",
    template: "%s | GradeForge",
  },
  description:
    "Free CGPA and GPA calculator for Pakistani university students. Supports UCP, UMT, UOL, HEC grading scales. Calculate semester GPA, predict relative grades, and simulate what-if scenarios.",
  authors: [{ name: "Zain Ali Rizvi" }],
  creator: "Zain Ali Rizvi",
  keywords: [
    "UCP grade calculator",
    "UCP CGPA calculator",
    "University of Central Punjab GPA calculator",
    "UMT CGPA calculator",
    "UOL grade calculator",
    "Pakistan CGPA calculator",
    "HEC grading scale calculator",
    "Pakistani university GPA calculator",
    "semester GPA calculator Pakistan",
    "relative grading calculator",
    "CGPA calculator Pakistan",
    "grade predictor Pakistan",
    "what if GPA simulator",
    "GPA calculator",
    "CGPA calculator",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "GradeForge",
    title: "GradeForge — UCP, UMT, UOL CGPA & GPA Calculator Pakistan",
    description:
      "Free CGPA and GPA calculator for Pakistani university students. Supports UCP, UMT, UOL, and HEC grading scales. Predict grades and simulate semester outcomes.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GradeForge — CGPA Calculator for Pakistani Universities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GradeForge — CGPA & GPA Calculator for Pakistani Universities",
    description:
      "Free tool for UCP, UMT, UOL students. Calculate CGPA, predict grades, simulate semester outcomes.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GradeForge",
  url: SITE_URL,
  description:
    "Free CGPA and GPA calculator for Pakistani university students supporting UCP, UMT, UOL, and HEC grading scales.",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Person", name: "Zain Ali Rizvi" },
  audience: {
    "@type": "EducationalAudience",
    educationalRole: "student",
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
        {/* SEO content — visible to crawlers, useful to users */}
        <section
          aria-label="About GradeForge"
          className="max-w-screen-xl mx-auto px-4 sm:px-6 pb-24 lg:pb-10 pt-4 border-t border-neutral-200 dark:border-neutral-800"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-neutral-400 dark:text-neutral-600">
            <div>
              <p className="font-semibold text-neutral-500 dark:text-neutral-500 mb-2">
                Supported Universities
              </p>
              <ul className="space-y-1">
                <li>UCP — University of Central Punjab</li>
                <li>UMT — University of Management &amp; Technology</li>
                <li>UOL — University of Lahore</li>
                <li>HEC Pakistan standard scale</li>
                <li>US, Canadian, UK scales</li>
                <li>Custom university scales</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-neutral-500 dark:text-neutral-500 mb-2">
                Features
              </p>
              <ul className="space-y-1">
                <li>Exact CGPA &amp; GPA calculator</li>
                <li>Relative grade predictor</li>
                <li>What-if semester simulator</li>
                <li>Custom grading scale editor</li>
                <li>Pessimistic / likely / optimistic outcomes</li>
                <li>Works offline, no account needed</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-neutral-500 dark:text-neutral-500 mb-2">
                Common Searches
              </p>
              <ul className="space-y-1">
                <li>UCP CGPA calculator</li>
                <li>UMT grade calculator</li>
                <li>UOL GPA calculator</li>
                <li>Pakistan HEC CGPA calculator</li>
                <li>Semester GPA calculator</li>
                <li>Relative grading estimator</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-neutral-500 dark:text-neutral-500 mb-2">
                About
              </p>
              <p className="leading-relaxed">
                GradeForge is a free academic utility built for Pakistani
                university students. All calculations are done in your browser
                — no data is sent to any server.
              </p>
              <p className="mt-2">Built by Zain Ali Rizvi.</p>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
