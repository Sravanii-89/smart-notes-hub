"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const branches = [

  {
    name: "First Year",
    path: "firstYear",
    description:
      "Common subjects for all branches.",
  },

  {
    name: "CSE",
    path: "CSE",
    description:
      "Explore CSE resources and notes.",
  },

  {
    name: "IT",
    path: "IT",
    description:
      "Explore IT resources and notes.",
  },

  {
    name: "ECE",
    path: "ECE",
    description:
      "Explore ECE resources and notes.",
  },

  {
    name: "EEE",
    path: "EEE",
    description:
      "Explore EEE resources and notes.",
  },

  {
    name: "MECH",
    path: "MECH",
    description:
      "Explore MECH resources and notes.",
  },

  {
    name: "CIVIL",
    path: "CIVIL",
    description:
      "Explore CIVIL resources and notes.",
  },

];

export default function HomePage() {

  return (

    <main
      className="
      min-h-screen
      relative
      overflow-hidden
      px-6
      md:px-16
      py-32"
    >

      {/* BACKGROUND */}
      <div
        className="
        absolute
        top-[-250px]
        left-[-150px]
        w-[600px]
        h-[600px]
        bg-blue-500/10
        rounded-full
        blur-[180px]"
      />

      <div
        className="
        absolute
        bottom-[-300px]
        right-[-200px]
        w-[700px]
        h-[700px]
        bg-cyan-500/10
        rounded-full
        blur-[200px]"
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
        className="
        relative
        z-10
        max-w-5xl"
      >

        <p
          className="
          uppercase
          tracking-[0.4em]
          text-blue-400
          text-sm
          mb-8"
        >

          Premium Academic Platform

        </p>

        <h1
          className="
          text-7xl
          md:text-9xl
          font-black
          leading-[0.95]"
        >

          Smart

          <span
            className="
            block
            text-blue-500"
          >

            Notes Hub

          </span>

        </h1>

        <p
          className="
          mt-10
          text-xl
          text-gray-400
          leading-relaxed
          max-w-3xl"
        >

          Discover academic resources,
          notes, PDFs and study material
          designed for GMRIT students.

        </p>

      </motion.section>

      {/* BRANCH GRID */}
      <section
        className="
        relative
        z-10
        mt-28"
      >

        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-8"
        >

          {branches.map(
            (
              branch,
              index
            ) => (

              <Link
                key={index}
                href={`/branch/${branch.path}`}
              >

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.08,
                  }}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
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

                      Branch

                    </p>

                    <h2
                      className="
                      text-5xl
                      font-black
                      text-white
                      group-hover:text-blue-100
                      transition"
                    >

                      {branch.name}

                    </h2>

                    <p
                      className="
                      mt-5
                      text-gray-400
                      text-lg
                      leading-relaxed"
                    >

                      {branch.description}

                    </p>

                  </div>

                </motion.div>

              </Link>

            )
          )}

        </div>

      </section>

    </main>
  );
}