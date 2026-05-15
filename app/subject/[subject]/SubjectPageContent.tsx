"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { slugToDisplayName, subjectToSlug } from "@/lib/subjects";

export default function SubjectPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const subjectSlug = String(params.subject ?? "");
  const subjectName = slugToDisplayName(subjectSlug);
  const branch = searchParams.get("branch") ?? "";
  const year = searchParams.get("year") ?? "";

  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);
  const [quiz, setQuiz] = useState<any[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [subjectName, branch, year]);

  async function fetchNotes() {
    setLoading(true);

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("subject", subjectName)
      .eq("branch", branch)
      .eq("year", year);

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setNotes(data || []);
    setLoading(false);
  }

  async function askAI() {
    if (!question) return;

    setAsking(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        context: `
Subject:
${subjectName}

Branch:
${branch}

Year:
${year}
`,
      }),
    });

    const data = await response.json();
    setAnswer(data.answer);
    setAsking(false);
  }

  async function generateQuiz() {
    setQuizLoading(true);

    const response = await fetch("/api/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: subjectName,
      }),
    });

    const data = await response.json();
    setQuiz(data.quiz || []);
    setQuizLoading(false);
  }

  const uploadHref = `/upload?subject=${encodeURIComponent(subjectToSlug(subjectName))}&branch=${encodeURIComponent(branch)}&year=${encodeURIComponent(year)}`;

  return (
    <main className="min-h-screen relative overflow-hidden px-6 md:px-16 py-32">
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-20"
      >
        <h1 className="text-6xl md:text-8xl font-black">{subjectName}</h1>

        <p className="mt-6 text-gray-400 text-xl">
          {branch} · {year}
        </p>

        <Link
          href={uploadHref}
          className="inline-block mt-8 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 font-semibold"
        >
          Upload notes for this subject
        </Link>
      </motion.section>

      <section className="mb-24">
        <h2 className="text-4xl font-black mb-8">Uploaded Notes</h2>

        {loading ? (
          <p className="text-xl text-gray-400">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="text-xl text-gray-400">
            No notes yet. Use the upload button above to add PDFs.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {notes.map((note) => (
              <motion.div
                key={note.id}
                className="rounded-[30px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-8"
              >
                <h3 className="text-3xl font-black mb-4">{note.title}</h3>
                <motion.div className="flex gap-4 mt-6">
                  <a
                    href={note.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-3 rounded-2xl bg-blue-600 hover:bg-blue-500"
                  >
                    Preview
                  </a>
                  <a
                    href={note.pdf_url}
                    download
                    className="flex-1 text-center py-3 rounded-2xl border border-white/10 bg-white/5"
                  >
                    Download
                  </a>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[40px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-10">
        <h2 className="text-5xl font-black text-blue-400 mb-10">
          AI Assistant 🤖
        </h2>

        <textarea
          placeholder="Ask anything..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full h-[160px] rounded-3xl bg-black/30 border border-white/10 p-6"
        />

        <button
          onClick={askAI}
          className="mt-8 px-10 py-5 rounded-2xl bg-blue-600"
        >
          {asking ? "Thinking..." : "Ask AI"}
        </button>

        {answer && (
          <motion.div className="mt-10 rounded-3xl bg-black/20 border border-white/10 p-8">
            <h3 className="text-3xl font-black mb-6">AI Response</h3>
            <motion.div className="whitespace-pre-wrap text-gray-300">
              {answer}
            </motion.div>
          </motion.div>
        )}
      </section>

      <section className="mt-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-5xl font-black text-cyan-400">AI Quiz 🚀</h2>

          <button
            onClick={generateQuiz}
            className="px-8 py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500"
          >
            {quizLoading ? "Generating..." : "Generate Quiz"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {quiz.map((q, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[30px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6">
                {index + 1}. {q.question}
              </h3>

              <div className="space-y-4">
                {q.options?.map((option: string, i: number) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border border-white/10 bg-black/20"
                  >
                    {option}
                  </div>
                ))}
              </div>

              <div className="mt-8 text-green-400 font-bold">
                Answer: {q.answer}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
