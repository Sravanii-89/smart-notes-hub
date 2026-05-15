"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import SubjectCard from "@/components/SubjectCard";
import YearCard from "@/components/YearCard";
import {
  getSubjectsForBranchYear,
  getYearsForBranch,
  isFirstYearBranch,
  normalizeBranchParam,
  subjectPageHref,
} from "@/lib/subjects";

export default function BranchPage() {
  const params = useParams();
  const branchParam = String(params.branch ?? "");
  const branchKey = normalizeBranchParam(branchParam);

  if (!branchKey) {
    return (
      <main className="min-h-screen px-6 md:px-16 py-32 text-white">
        <h1 className="text-5xl font-black">Branch not found</h1>
        <Link href="/" className="mt-8 inline-block text-blue-400">
          Back to home
        </Link>
      </main>
    );
  }

  const displayBranch =
    branchKey === "firstYear" ? "First Year" : branchKey;

  const isFirstYear = isFirstYearBranch(branchParam);
  const years = getYearsForBranch(branchParam);
  const firstYearSubjects = isFirstYear
    ? getSubjectsForBranchYear(branchParam, "firstYear")
    : [];

  const gridClass =
    "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8";

  return (
    <main className="min-h-screen relative overflow-hidden px-6 md:px-16 py-32">
      <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[160px]" />
      <motion.div className="absolute bottom-[-300px] right-[-200px] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[180px]" />

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10"
      >
        <p className="uppercase tracking-[0.4em] text-blue-400 text-sm mb-6">
          Branch Academic Portal
        </p>

        <h1 className="text-6xl md:text-8xl font-black leading-tight">
          {displayBranch}
        </h1>

        <p className="mt-8 text-xl text-gray-400 max-w-2xl leading-relaxed">
          {isFirstYear
            ? "Common first-year subjects for all branches."
            : `Explore subjects, notes, PDFs and academic resources for the ${displayBranch} branch.`}
        </p>
      </motion.section>

      <section className="relative z-10 mt-24">
        {isFirstYear ? (
          <motion.div className={gridClass}>
            {firstYearSubjects.map((subject, index) => (
              <SubjectCard
                key={subject}
                href={subjectPageHref(
                  subject,
                  "firstYear",
                  "firstYear"
                )}
                title={subject}
                index={index}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div className={gridClass}>
            {years.map((year, index) => (
              <YearCard
                key={year}
                href={`/branch/${branchKey}/${year}`}
                year={year}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </section>
    </main>
  );
}
