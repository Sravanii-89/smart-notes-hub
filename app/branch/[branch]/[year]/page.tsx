import Link from "next/link";
import SubjectCard from "@/components/SubjectCard";
import {
  formatYearLabel,
  getSubjectsForBranchYear,
  normalizeBranchParam,
  subjectPageHref,
} from "@/lib/subjects";

export default async function YearPage({
  params,
}: {
  params: Promise<{
    branch: string;
    year: string;
  }>;
}) {
  const { branch: branchParam, year } = await params;
  const branchKey = normalizeBranchParam(branchParam);

  if (!branchKey || branchKey === "firstYear") {
    return (
      <main className="min-h-screen px-6 md:px-16 py-32 text-white">
        <h1 className="text-5xl font-black">Year not found</h1>
        <Link href="/" className="mt-8 inline-block text-blue-400">
          Back to home
        </Link>
      </main>
    );
  }

  const subjects = getSubjectsForBranchYear(branchParam, year);

  if (!subjects.length) {
    return (
      <main className="min-h-screen px-6 md:px-16 py-32 text-white">
        <h1 className="text-5xl font-black">Subjects not found</h1>
        <Link
          href={`/branch/${branchKey}`}
          className="mt-8 inline-block text-blue-400"
        >
          Back to {branchKey}
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden px-6 md:px-16 py-32">
      <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[160px]" />
      <div className="absolute bottom-[-300px] right-[-200px] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[180px]" />

      <section className="relative z-10">
        <Link
          href={`/branch/${branchKey}`}
          className="text-blue-400 hover:text-blue-300 mb-8 inline-block"
        >
          ← Back to {branchKey}
        </Link>

        <p className="uppercase tracking-[0.4em] text-blue-400 text-sm mb-6">
          {branchKey}
        </p>

        <h1 className="text-6xl md:text-8xl font-black leading-tight capitalize">
          {formatYearLabel(year)}
        </h1>

        <p className="mt-8 text-xl text-gray-400 max-w-2xl leading-relaxed">
          Select a subject to explore notes, PDFs, and academic resources.
        </p>
      </section>

      <section className="relative z-10 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {subjects.map((subject, index) => (
            <SubjectCard
              key={subject}
              href={subjectPageHref(subject, branchKey, year)}
              title={subject}
              index={index}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
