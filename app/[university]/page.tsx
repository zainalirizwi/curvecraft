import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UniversityLandingClient } from "./UniversityLandingClient";

// ─── University Config ────────────────────────────────────────────────────────

interface UniversityConfig {
  scaleId: string;
  fullName: string;
  shortName: string;
  description: string;
  keywords: string[];
}

const UNIVERSITY_MAP: Record<string, UniversityConfig> = {
  ucp: {
    scaleId: "ucp",
    fullName: "University of Central Punjab",
    shortName: "UCP",
    description:
      "Free CGPA and GPA calculator for UCP students. Uses the official University of Central Punjab grading scale (A=4.0, D+=1.33). Calculate your semester GPA, predict grades, and simulate what-if scenarios.",
    keywords: [
      "UCP grade calculator",
      "UCP CGPA calculator",
      "University of Central Punjab GPA calculator",
      "UCP semester GPA",
      "UCP grading scale",
      "UCP grade points",
    ],
  },
  umt: {
    scaleId: "umt",
    fullName: "University of Management and Technology",
    shortName: "UMT",
    description:
      "Free CGPA and GPA calculator for UMT students. Uses the official University of Management and Technology grading scale with relative grading support. Calculate semester GPA and predict grade outcomes.",
    keywords: [
      "UMT grade calculator",
      "UMT CGPA calculator",
      "University of Management and Technology GPA",
      "UMT semester GPA",
      "UMT grading scale",
      "UMT relative grading",
    ],
  },
  uol: {
    scaleId: "uol",
    fullName: "University of Lahore",
    shortName: "UOL",
    description:
      "Free CGPA and GPA calculator for UOL students. Uses the official University of Lahore grading scale (A=4.0, A-=3.75, B+=3.50). Calculate your semester GPA and simulate grade outcomes.",
    keywords: [
      "UOL grade calculator",
      "UOL CGPA calculator",
      "University of Lahore GPA calculator",
      "UOL semester GPA",
      "UOL grading scale",
      "UOL grade points",
    ],
  },
  hec: {
    scaleId: "hec-pakistan",
    fullName: "HEC Pakistan",
    shortName: "HEC",
    description:
      "Free CGPA and GPA calculator using the HEC Pakistan standard grading scale. Supports all Pakistani universities following HEC guidelines. Calculate semester GPA, predict grades, and simulate scenarios.",
    keywords: [
      "HEC Pakistan CGPA calculator",
      "HEC grading scale calculator",
      "Pakistan GPA calculator",
      "HEC grade points",
      "Pakistani university CGPA",
      "Pakistan semester GPA calculator",
    ],
  },
};

// ─── Static Params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return Object.keys(UNIVERSITY_MAP).map((u) => ({ university: u }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { university: string };
}): Promise<Metadata> {
  const config = UNIVERSITY_MAP[params.university.toLowerCase()];
  if (!config) return {};

  const title = `${config.shortName} CGPA & GPA Calculator — GradeForge`;

  return {
    title,
    description: config.description,
    keywords: config.keywords,
    openGraph: {
      title,
      description: config.description,
    },
    twitter: {
      title,
      description: config.description,
    },
    alternates: {
      canonical: `/${params.university}`,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UniversityPage({
  params,
}: {
  params: { university: string };
}) {
  const slug = params.university.toLowerCase();
  const config = UNIVERSITY_MAP[slug];

  if (!config) notFound();

  return <UniversityLandingClient scaleId={config.scaleId} university={config} />;
}
