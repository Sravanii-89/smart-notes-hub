"use client";

import { motion } from "framer-motion";

export default function BackgroundEffects() {

  return (

    <div className="fixed inset-0 -z-10 overflow-hidden">

      {/* BLUE GLOW */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="
        absolute
        top-20
        left-10
        w-72
        h-72
        bg-blue-600/30
        rounded-full
        blur-3xl"
      />

      {/* CYAN GLOW */}
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
        className="
        absolute
        bottom-10
        right-10
        w-96
        h-96
        bg-cyan-500/20
        rounded-full
        blur-3xl"
      />

      {/* CENTER LIGHT */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="
        absolute
        top-1/2
        left-1/2
        w-[500px]
        h-[500px]
        bg-blue-900/20
        rounded-full
        blur-3xl"
      />

    </div>
  );
}