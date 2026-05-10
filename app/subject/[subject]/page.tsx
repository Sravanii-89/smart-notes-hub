"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import { supabase } from "@/lib/supabase";

import {
  motion,
} from "framer-motion";

export default function SubjectPage({
  params,
}: any) {

  const subject =
    decodeURIComponent(
      params.subject
    );

  const searchParams =
    useSearchParams();

  const branch =
    searchParams.get("branch");

  const year =
    searchParams.get("year");

  const [notes, setNotes] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  /* AI CHAT */
  const [question, setQuestion] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [asking, setAsking] =
    useState(false);

  /* QUIZ */
  const [quiz, setQuiz] =
    useState<any[]>([]);

  const [quizLoading, setQuizLoading] =
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
      .select("*")
      .eq("subject", subject)
      .eq("branch", branch)
      .eq("year", year);

    if (error) {

      console.log(error);

      return;
    }

    setNotes(data || []);

    setLoading(false);
  }

  async function askAI() {

    if (!question) return;

    setAsking(true);

    const response =
      await fetch(
        "/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            question,

            context:
              `
Subject:
${subject}

Branch:
${branch}

Year:
${year}
`,
          }),

        }
      );

    const data =
      await response.json();

    setAnswer(data.answer);

    setAsking(false);
  }

  async function generateQuiz() {

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
            subject,
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

        <h1
          className="
          text-6xl
          md:text-8xl
          font-black"
        >

          {subject
            .split("-")
            .map(
              (word: string) =>
                word[0]
                  .toUpperCase() +
                word.slice(1)
            )
            .join(" ")}

        </h1>

      </motion.section>

      {/* AI CHAT */}
      <section
        className="
        rounded-[40px]
        border
        border-white/10
        bg-white/[0.03]
        backdrop-blur-2xl
        p-10"
      >

        <h2
          className="
          text-5xl
          font-black
          text-blue-400
          mb-10"
        >

          AI Assistant 🤖

        </h2>

        <textarea
          placeholder="Ask anything..."
          value={question}
          onChange={(e) =>
            setQuestion(
              e.target.value
            )
          }
          className="
          w-full
          h-[160px]
          rounded-3xl
          bg-black/30
          border
          border-white/10
          p-6"
        />

        <button
          onClick={askAI}
          className="
          mt-8
          px-10
          py-5
          rounded-2xl
          bg-blue-600"
        >

          {asking
            ? "Thinking..."
            : "Ask AI"}

        </button>

        {answer && (

          <div
            className="
            mt-10
            rounded-3xl
            bg-black/20
            border
            border-white/10
            p-8"
          >

            <h3
              className="
              text-3xl
              font-black
              mb-6"
            >

              AI Response

            </h3>

            <div
              className="
              whitespace-pre-wrap
              text-gray-300"
            >

              {answer}

            </div>

          </div>

        )}

      </section>

      {/* QUIZ */}
      <section className="mt-24">

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
            onClick={generateQuiz}
            className="
            px-8
            py-4
            rounded-2xl
            bg-cyan-600
            hover:bg-cyan-500"
          >

            {quizLoading
              ? "Generating..."
              : "Generate Quiz"}

          </button>

        </div>

        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-8"
        >

          {quiz.map(
            (
              q,
              index
            ) => (

              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                rounded-[30px]
                border
                border-white/10
                bg-white/[0.03]
                backdrop-blur-2xl
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
                  mt-8
                  text-green-400
                  font-bold"
                >

                  Answer:
                  {" "}
                  {q.answer}

                </div>

              </motion.div>

            )
          )}

        </div>

      </section>

    </main>
  );
}
