"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { cn } from "@/lib/utils";

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between gap-3 py-4 px-1 text-left hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            aria-expanded={openIndex === i}
          >
            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              {item.title}
            </span>
            {openIndex === i ? (
              <ChevronUp size={16} className="text-neutral-400 flex-shrink-0" />
            ) : (
              <ChevronDown size={16} className="text-neutral-400 flex-shrink-0" />
            )}
          </button>
          {openIndex === i && (
            <div className="pb-5 px-1 animate-fade-in text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Code({ children }: { children: string }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-mono">
      {children}
    </code>
  );
}

function Formula({ children }: { children: string }) {
  return (
    <div className="my-3 px-4 py-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 font-mono text-sm text-neutral-800 dark:text-neutral-200">
      {children}
    </div>
  );
}

const ITEMS: AccordionItem[] = [
  {
    title: "How is GPA calculated?",
    content: (
      <div className="space-y-3">
        <p>
          GPA (Grade Point Average) is a weighted average of your grade points across all
          subjects in a semester, weighted by credit hours.
        </p>
        <Formula>GPA = Σ(Credit Hours × Grade Points) / Σ(Credit Hours)</Formula>
        <p>
          For example, if you take a 3-credit course worth 4.0 points and a 2-credit course
          worth 3.0 points:
        </p>
        <Formula>GPA = (3 × 4.0 + 2 × 3.0) / (3 + 2) = 18 / 5 = 3.60</Formula>
        <p>
          Subjects with higher credit hours have a proportionally greater impact on your GPA.
          A zero-credit-hour total returns a GPA of 0.
        </p>
      </div>
    ),
  },
  {
    title: "How is Cumulative CGPA calculated?",
    content: (
      <div className="space-y-3">
        <p>
          Cumulative CGPA takes into account your entire academic history — not just the
          current semester. It combines your previous earned quality points with the current
          semester&apos;s quality points.
        </p>
        <Formula>
          CGPA = (Previous CGPA × Previous Earned CH + Current Semester Quality Points) / (Previous Earned CH + Current Semester CH)
        </Formula>
        <p>
          This is equivalent to computing a weighted average of all semesters combined.
          The more credit hours you have already earned, the less impact a single semester
          can have on your CGPA.
        </p>
        <p>
          <strong>Quality Points</strong> = Σ(Credit Hours × Grade Points) for each subject.
        </p>
      </div>
    ),
  },
  {
    title: "How does the Grade Predictor work?",
    content: (
      <div className="space-y-4">
        <p>
          The predictor uses a transparent, deterministic rule-based engine — not machine
          learning or a black box. Every adjustment is documented and surfaced to you.
        </p>
        <p>
          For each subject, we start with your expected percentage score and apply four
          adjustments:
        </p>
        <div className="space-y-2">
          <div className="card p-3">
            <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
              Class Standing Adjustment
            </p>
            <p className="text-xs">
              Top 5% → +8 &nbsp;|&nbsp; Top 10% → +6 &nbsp;|&nbsp; Top 20% → +4 &nbsp;|&nbsp;
              Above Avg → +2 &nbsp;|&nbsp; Average → 0 &nbsp;|&nbsp; Below Avg → −4
            </p>
          </div>
          <div className="card p-3">
            <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
              Course Difficulty Adjustment
            </p>
            <p className="text-xs">Hard → +3 &nbsp;|&nbsp; Moderate → 0 &nbsp;|&nbsp; Easy → −2</p>
          </div>
          <div className="card p-3">
            <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
              Instructor Strictness Adjustment
            </p>
            <p className="text-xs">Lenient → +1 &nbsp;|&nbsp; Normal → 0 &nbsp;|&nbsp; Strict → −2</p>
          </div>
          <div className="card p-3">
            <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
              Class Size Adjustment
            </p>
            <p className="text-xs">
              &lt;20 → −1 &nbsp;|&nbsp; 20–50 → 0 &nbsp;|&nbsp; 51–100 → +1 &nbsp;|&nbsp; &gt;100 → +2
            </p>
          </div>
        </div>
        <Formula>Adjusted Score = clamp(Base + A_rank + A_diff + A_strict + A_size, 0, 100)</Formula>
        <p>
          The adjusted score is then mapped to a grade using your active grading scale.
          An optimistic score (+3) and pessimistic score (−5) are also computed and mapped
          to give you a range.
        </p>
      </div>
    ),
  },
  {
    title: "Why can't relative grading be predicted exactly?",
    content: (
      <div className="space-y-3">
        <p>
          Relative (or curved) grading sets grade boundaries based on how the entire class
          performs on an exam — not on absolute score thresholds. This means:
        </p>
        <ul className="space-y-2 list-none">
          {[
            "The cut-offs are only known after all results are in.",
            "A hard exam might lower the class average, raising everyone's relative standing.",
            "A strong cohort might push cut-offs up.",
            "Instructor discretion and institutional policies vary widely.",
          ].map((pt) => (
            <li key={pt} className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-neutral-400 flex-shrink-0" />
              {pt}
            </li>
          ))}
        </ul>
        <p>
          GradeForge&apos;s predictor uses reasonable proxy signals (class standing, difficulty,
          strictness, class size) to estimate an outcome — but it cannot know the actual
          distribution of your class&apos;s performance. Treat predictions as informed estimates,
          not guarantees.
        </p>
      </div>
    ),
  },
  {
    title: "What does Confidence mean?",
    content: (
      <div className="space-y-3">
        <p>
          Confidence reflects how reliable the predictor&apos;s estimate is, based on the
          quality and completeness of your inputs.
        </p>
        <div className="space-y-2">
          {[
            { label: "Starts at 100%", note: "with all inputs provided." },
            { label: "−20%",           note: "if grading type is marked as Unsure." },
            { label: "−15%",           note: "if class size is fewer than 20 students." },
            { label: "−10%",           note: "if class standing is Average or Below Average." },
            { label: "−25%",           note: "if no expected percentage score is provided." },
          ].map(({ label, note }) => (
            <div key={label} className="flex items-start gap-3 text-sm">
              <Code>{label}</Code>
              <span>{note}</span>
            </div>
          ))}
        </div>
        <p>
          Mapped to: <Code>0–40</Code> → Low &nbsp;|&nbsp; <Code>41–70</Code> → Medium &nbsp;|&nbsp;
          <Code>71–100</Code> → High
        </p>
        <p>
          Low confidence doesn&apos;t mean the prediction is wrong — it means there&apos;s higher
          uncertainty and the actual outcome may differ more from the estimate.
        </p>
      </div>
    ),
  },
  {
    title: "Are these results official?",
    content: (
      <p>
        No. GradeForge is an academic planning tool for students. All calculations —
        whether exact or predicted — are advisory only and are based on the data you enter.
        They do not reflect any official academic record. Always consult your institution&apos;s
        official systems for verified grades and CGPA. GradeForge stores all data locally
        in your browser and does not send any information to a server.
      </p>
    ),
  },
  {
    title: "How is data stored?",
    content: (
      <p>
        All your data (subjects, previous CGPA, grading scales, scenarios, preferences)
        is saved entirely in your browser&apos;s <Code>localStorage</Code>. Nothing is sent
        to any server. Clearing your browser data or using a different browser will reset
        your saved state. Consider exporting important data manually if needed.
      </p>
    ),
  },
];

export function ExplanationPanel() {
  return (
    <SectionContainer
      title="How It Works"
      description="Transparent documentation of every calculation and algorithm in GradeForge."
    >
      <div className="card p-4 sm:p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <BookOpen size={18} className="text-indigo-600 dark:text-indigo-400" />
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            GradeForge uses entirely deterministic, auditable math. No black boxes.
          </p>
        </div>
        <Accordion items={ITEMS} />
      </div>

      {/* Attribution */}
      <div className="text-center pt-2 pb-4">
        <p className="text-xs text-neutral-400 dark:text-neutral-600">
          GradeForge — built with care by{" "}
          <span className="text-neutral-600 dark:text-neutral-400 font-medium">Zain Ali Rizvi</span>
        </p>
      </div>
    </SectionContainer>
  );
}
