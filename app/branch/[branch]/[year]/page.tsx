import Link from "next/link";
import { subjectsData } from "@/data/subjects";

export default async function YearPage({
  params,
}: {
  params: Promise<{
    branch: string;
    year: string;
  }>;
}) {

  const resolvedParams =
    await params;

  const branch =
    resolvedParams.branch.toUpperCase();

  const year =
    resolvedParams.year;

  const branchData =
    subjectsData[
      branch as keyof typeof subjectsData
    ] as any;

  const subjects =
    branchData?.[year];

  if (!subjects) {

    return (
      <div className="text-white p-20 text-5xl">
        Subjects Not Found
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-6xl font-bold text-blue-400 mb-4">
        {branch}
      </h1>

      <p className="text-3xl text-gray-300 mb-12 capitalize">

        {year.replace("Year", " Year")}

      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {subjects.map(
          (
            subject: string,
            index: number
          ) => {

            const slug =
              subject
                .toLowerCase()
                .replace(/&/g, "and")
                .replace(/\s+/g, "-");

            return (

              <Link
                key={index}
                href={`/subject/${slug}?branch=${branch}&year=${year}`}
              >

                <div
                  className="
                  bg-[#06143a]
                  border
                  border-blue-900
                  rounded-3xl
                  p-8
                  hover:scale-105
                  transition
                  shadow-2xl"
                >

                  <h2 className="text-2xl font-bold">
                    {subject}
                  </h2>

                </div>

              </Link>

            );
          }
        )}

      </div>

    </div>
  );
}