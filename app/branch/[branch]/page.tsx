"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const subjectsData: any = {
  firstYear: {
    firstYear: [
      "Engineering Physics",
      "Engineering Chemistry",
      "BEEE",
      "BCME",
      "Engineering Graphics",
      "Communicative English",
    ],
  },

  CSE: {
    secondYear: [
      "Problem Solving Using Python",
      "Operating Systems",
      "Artificial Intelligence",
      "Database Management Systems",
      "Foundations of Machine Learning",
      "Web Coding and Development",
    ],

    thirdYear: [
      "Deep Learning",
      "Computer Networks",
      "Compiler Design",
      "Cloud Computing",
      "Software Engineering",
      "Cryptography and Network Security",
    ],

    fourthYear: [
      "Natural Language Processing",
      "Cloud Security",
      "Web Application Databases",
    ],
  },

  IT: {
    secondYear: [
      "Database Management Systems",
      "Operating Systems",
      "Probability and Statistics",
      "Web Technologies",
    ],

    thirdYear: [
      "Machine Learning",
      "Deep Learning",
      "Artificial Intelligence",
      "Cloud Computing",
    ],

    fourthYear: [
      "Natural Language Processing",
    ],
  },

  ECE: {
    secondYear: [
      "Python Programming",
      "Signals and Systems",
      "Electronic Devices and Circuits",
    ],

    thirdYear: [
      "VLSI Design",
      "DSP",
      "Microprocessors",
    ],

    fourthYear: [
      "Project Work",
    ],
  },

  EEE: {
    secondYear: [
      "Circuit Analysis",
      "DC Machines",
      "Signal Systems",
    ],

    thirdYear: [
      "Control Systems",
      "Power System Protection",
    ],

    fourthYear: [
      "Project Work",
    ],
  },

  MECH: {
    secondYear: [
      "Thermodynamics",
      "Fluid Mechanics",
      "Kinematics",
    ],

    thirdYear: [
      "CAD & CAM",
      "Heat Transfer",
      "FEM",
    ],

    fourthYear: [
      "Project Work",
    ],
  },

  CIVIL: {
    secondYear: [
      "Fluid Mechanics",
      "Surveying",
      "Soil Mechanics",
    ],

    thirdYear: [
      "RC Structures",
      "Hydrology",
      "Environmental Engineering",
    ],

    fourthYear: [
      "Project Work",
    ],
  },
};

export default async function BranchPage({
  params,
}: {
  params: Promise<{
    branch: string;
  }>;
}) {
  const { branch } = await params;

  const decodedBranch = decodeURIComponent(branch);

  const years = subjectsData[decodedBranch];

  if (!years) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center text-5xl">
        Branch not found
      </main>
    );
  }

  return (
    <main
      className="
      min-h-screen
      relative
      overflow-hidden
      px-6
      md:px-16
      py-32
      bg-black
      text-white"
    >
      {/* BACKGROUND */}
      <div
        className="
        absolute
        top-[-200px]
        left-[-100px]
        w-[500px]
        h-[500px]
        bg-blue-500/10
        rounded-full
        blur-[160px]"
      />

      <div
        className="
        absolute
        bottom-[-300px]
        right-[-200px]
        w-[600px]
        h-[600px]
        bg-cyan-500/10
        rounded-full
        blur-[180px]"
      />

      {/* HERO */}
      <motion.section
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1,
        }}
        className="relative z-10"
      >
        <p
          className="
          uppercase
          tracking-[0.4em]
          text-blue-400
          text-sm
          mb-6"
        >
          Branch Academic Portal
        </p>

        <h1
          className="
          text-6xl
          md:text-8xl
          font-black
          leading-tight"
        >
          {decodedBranch}
        </h1>

        <p
          className="
          mt-8
          text-xl
          text-gray-400
          max-w-2xl
          leading-relaxed"
        >
          Explore subjects, notes, PDFs and academic resources
          for the {decodedBranch} branch.
        </p>
      </motion.section>

      {/* YEARS */}
      <section
        className="
        relative
        z-10
        mt-24
        space-y-28"
      >
        {Object.entries(years).map(
          ([year, subjects]: any) => (
            <motion.div
              key={year}
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.8,
              }}
            >
              {/* YEAR TITLE */}
              <div className="mb-14">
                <h2
                  className="
                  text-5xl
                  font-black
                  text-white"
                >
                  {year}
                </h2>
              </div>

              {/* SUBJECT GRID */}
              <div
                className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-8"
              >
                {subjects.map(
                  (
                    subject: string,
                    index: number
                  ) => (
                    <Link
                      key={index}
                      href={`/subject/${subject
                        .toLowerCase()
                        .replace(/\s+/g, "-")}?branch=${decodedBranch}&year=${year}`}
                    >
                      <motion.div
                        whileHover={{
                          y: -10,
                          scale: 1.02,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                        }}
                        className="
                        group
                        relative
                        overflow-hidden
                        rounded-[35px]
                        border
                        border-white/10
                        bg-white/[0.03]
                        backdrop-blur-2xl
                        p-10
                        h-[240px]
                        cursor-pointer
                        flex
                        flex-col
                        justify-end"
                      >
                        {/* GLOW */}
                        <div
                          className="
                          absolute
                          inset-0
                          opacity-0
                          group-hover:opacity-100
                          transition
                          duration-700
                          bg-gradient-to-br
                          from-blue-500/10
                          via-cyan-500/5
                          to-transparent"
                        />

                        {/* TOP LIGHT */}
                        <div
                          className="
                          absolute
                          top-0
                          left-0
                          w-full
                          h-[1px]
                          bg-gradient-to-r
                          from-transparent
                          via-blue-400/40
                          to-transparent"
                        />

                        <div className="relative z-10">
                          <p
                            className="
                            text-blue-400
                            uppercase
                            tracking-[0.25em]
                            text-xs
                            mb-5"
                          >
                            Subject
                          </p>

                          <h3
                            className="
                            text-4xl
                            font-black
                            leading-tight
                            text-white
                            group-hover:text-blue-100
                            transition"
                          >
                            {subject}
                          </h3>

                          <p
                            className="
                            mt-5
                            text-gray-400
                            text-lg
                            leading-relaxed"
                          >
                            Explore notes, PDFs and academic resources.
                          </p>
                        </div>
                      </motion.div>
                    </Link>
                  )
                )}
              </div>
            </motion.div>
          )
        )}
      </section>
    </main>
  );
}