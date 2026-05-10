"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

export default function NotesPage() {

  const [notes, setNotes] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  /* AI SUMMARY */
  const [summary, setSummary] =
    useState("");

  const [summaryLoading, setSummaryLoading] =
    useState(false);

  const [showSummary, setShowSummary] =
    useState(false);

  /* QUIZ */
  const [quiz, setQuiz] =
    useState<any[]>([]);

  const [quizLoading, setQuizLoading] =
    useState(false);

  const [showQuiz, setShowQuiz] =
    useState(false);

  useEffect(() => {

    fetchNotes();

  }, []);

  async function fetchNotes() {

    const {
      data,
      error,
    } = await supabase
      .from("notes")
      .select("*");

    if (error) {

      console.log(error);

      return;
    }

    setNotes(data || []);

    setLoading(false);
  }

  async function generateSummary(
    note: any
  ) {

    setShowSummary(true);

    setSummaryLoading(true);

    const response =
      await fetch(
        "/api/summary",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            text:
              `
Title:
${note.title}

Subject:
${note.subject}

Branch:
${note.branch}

Year:
${note.year}

Generate detailed engineering notes summary.
`,
          }),

        }
      );

    const data =
      await response.json();

    setSummary(data.summary);

    setSummaryLoading(false);
  }

  async function generateQuiz(
    note: any
  ) {

    setShowQuiz(true);

    setQuizLoading(true);

    const response =
      await fetch(
        "/api/quiz",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            subject:
              note.subject,
          }),

        }
      );

    const data =
      await response.json();

    setQuiz(data.quiz || []);

    setQuizLoading(false);
  }

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
        className="mb-20"
      >

        <p
          className="
          uppercase
          tracking-[0.4em]
          text-blue-400
          text-sm
          mb-6"
        >

          AI Powered Academic Library

        </p>

        <h1
          className="
          text-7xl
          md:text-8xl
          font-black"
        >

          Smart Notes

        </h1>

      </motion.section>

      {/* NOTES */}
      {loading ? (

        <h2 className="text-3xl">

          Loading...

        </h2>

      ) : (

        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-8"
        >

          {notes.map(
            (
              note,
              index
            ) => (

              <motion.div
                key={note.id}
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
                    index * 0.05,
                }}
                whileHover={{
                  y: -10,
                }}
                className="
                relative
                overflow-hidden
                rounded-[35px]
                border
                border-white/10
                bg-white/[0.03]
                backdrop-blur-2xl
                p-8"
              >

                {/* GLOW */}
                <div
                  className="
                  absolute
                  inset-0
                  opacity-0
                  hover:opacity-100
                  transition
                  duration-700
                  bg-gradient-to-br
                  from-blue-500/10
                  via-cyan-500/5
                  to-transparent"
                />

                <div className="relative z-10">

                  <p
                    className="
                    text-blue-400
                    uppercase
                    tracking-[0.25em]
                    text-xs
                    mb-4"
                  >

                    {note.subject}

                  </p>

                  <h2
                    className="
                    text-4xl
                    font-black
                    leading-tight"
                  >

                    {note.title}

                  </h2>

                  <div
                    className="
                    mt-6
                    space-y-2
                    text-gray-400"
                  >

                    <p>
                      Branch:
                      {" "}
                      {note.branch}
                    </p>

                    <p>
                      Year:
                      {" "}
                      {note.year}
                    </p>

                  </div>

                  {/* BUTTONS */}
                  <div
                    className="
                    mt-10
                    flex
                    gap-4"
                  >

                    <a
                      href={
                        note.pdf_url
                      }
                      target="_blank"
                      className="
                      flex-1
                      text-center
                      py-4
                      rounded-2xl
                      bg-blue-600
                      hover:bg-blue-500"
                    >

                      Preview

                    </a>

                    <a
                      href={
                        note.pdf_url
                      }
                      download
                      className="
                      flex-1
                      text-center
                      py-4
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/5"
                    >

                      Download

                    </a>

                  </div>

                  {/* AI BUTTONS */}
                  <div
                    className="
                    mt-5
                    flex
                    gap-4"
                  >

                    <button
                      onClick={() =>
                        generateSummary(
                          note
                        )
                      }
                      className="
                      flex-1
                      py-4
                      rounded-2xl
                      bg-blue-500/10
                      border
                      border-blue-500/20
                      text-blue-300"
                    >

                      AI Summary 🤖

                    </button>

                    <button
                      onClick={() =>
                        generateQuiz(
                          note
                        )
                      }
                      className="
                      flex-1
                      py-4
                      rounded-2xl
                      bg-cyan-500/10
                      border
                      border-cyan-500/20
                      text-cyan-300"
                    >

                      Quiz 🚀

                    </button>

                  </div>

                </div>

              </motion.div>

            )
          )}

        </div>

      )}

      {/* SUMMARY MODAL */}
      <AnimatePresence>

        {showSummary && (

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
            fixed
            inset-0
            bg-black/70
            backdrop-blur-xl
            z-50
            flex
            items-center
            justify-center
            p-6"
          >

            <motion.div
              initial={{
                scale: 0.9,
              }}
              animate={{
                scale: 1,
              }}
              className="
              max-w-3xl
              w-full
              rounded-[40px]
              border
              border-blue-500/20
              bg-[#050816]
              p-10
              max-h-[90vh]
              overflow-y-auto"
            >

              <div
                className="
                flex
                items-center
                justify-between
                mb-8"
              >

                <h2
                  className="
                  text-5xl
                  font-black
                  text-blue-400"
                >

                  AI Summary

                </h2>

                <button
                  onClick={() =>
                    setShowSummary(
                      false
                    )
                  }
                  className="
                  text-gray-400
                  text-2xl"
                >

                  ✕
                </button>

              </div>

              {summaryLoading ? (

                <p className="text-xl">

                  Generating...

                </p>

              ) : (

                <div
                  className="
                  whitespace-pre-wrap
                  text-lg
                  text-gray-300
                  leading-relaxed"
                >

                  {summary}

                </div>

              )}

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

      {/* QUIZ MODAL */}
      <AnimatePresence>

        {showQuiz && (

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
            fixed
            inset-0
            bg-black/70
            backdrop-blur-xl
            z-50
            flex
            items-center
            justify-center
            p-6"
          >

            <motion.div
              initial={{
                scale: 0.9,
              }}
              animate={{
                scale: 1,
              }}
              className="
              max-w-5xl
              w-full
              rounded-[40px]
              border
              border-cyan-500/20
              bg-[#050816]
              p-10
              max-h-[90vh]
              overflow-y-auto"
            >

              <div
                className="
                flex
                items-center
                justify-between
                mb-10"
              >

                <h2
                  className="
                  text-5xl
                  font-black
                  text-cyan-400"
                >

                  AI Quiz 🚀

                </h2>

                <button
                  onClick={() =>
                    setShowQuiz(
                      false
                    )
                  }
                  className="
                  text-gray-400
                  text-2xl"
                >

                  ✕
                </button>

              </div>

              {quizLoading ? (

                <p className="text-xl">

                  Generating Quiz...

                </p>

              ) : (

                <div className="space-y-8">

                  {quiz.map(
                    (
                      q,
                      index
                    ) => (

                      <div
                        key={index}
                        className="
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/[0.03]
                        p-8"
                      >

                        <h3
                          className="
                          text-2xl
                          font-bold
                          mb-6"
                        >

                          {index + 1}.
                          {" "}
                          {q.question}

                        </h3>

                        <div className="space-y-4">

                          {q.options?.map(
                            (
                              option: string,
                              i: number
                            ) => (

                              <div
                                key={i}
                                className="
                                p-4
                                rounded-2xl
                                border
                                border-white/10
                                bg-black/20"
                              >

                                {option}

                              </div>

                            )
                          )}

                        </div>

                        <div
                          className="
                          mt-6
                          text-green-400
                          font-bold"
                        >

                          Answer:
                          {" "}
                          {q.answer}

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </main>
  );
}