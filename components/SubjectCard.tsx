"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type SubjectCardProps = {
  href: string;
  title: string;
  index?: number;
};

export default function SubjectCard({
  href,
  title,
  index = 0,
}: SubjectCardProps) {
  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.04 }}
        whileHover={{ y: -10, scale: 1.02 }}
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
        <motion.div
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

        <motion.div
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
            {title}
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
  );
}
