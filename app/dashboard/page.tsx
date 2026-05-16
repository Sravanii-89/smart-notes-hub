"use client";

import {
  useEffect,
  useState,
} from "react";

import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { resolvePdfUrl } from "@/lib/storage";

import {
  motion,
} from "framer-motion";

export default function DashboardPage() {

  const [notes, setNotes] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchNotes();

  }, []);

  async function fetchNotes() {
    setLoading(true);

    if (!isSupabaseConfigured) {
      setNotes([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setNotes([]);
    } else {
      setNotes(data || []);
    }

    setLoading(false);
  }

  return (

    <main
      className="
      min-h-screen
      px-6
      md:px-16
      pt-40
      pb-20"
    >

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >

        <h1
          className="
          text-5xl
          md:text-7xl
          font-black
          mb-4"
        >

          Dashboard

        </h1>

        <p
          className="
          text-gray-400
          text-lg
          mb-16"
        >

          Manage uploaded notes.

        </p>

      </motion.div>

      {loading ? (

        <div className="loader" />

      ) : notes.length === 0 ? (

        <div
          className="
          premium-card
          p-16
          text-center"
        >

          <h2
            className="
            text-4xl
            font-bold
            mb-4"
          >

            No Uploads Yet

          </h2>

          <p className="text-gray-400">

            Upload notes to see them here.

          </p>

        </div>

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
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    index * 0.05,
                }}
                className="
                premium-card
                p-8"
              >

                <p
                  className="
                  text-blue-400
                  text-sm
                  uppercase
                  tracking-[0.3em]
                  mb-4"
                >

                  {note.subject}

                </p>

                <h2
                  className="
                  text-3xl
                  font-black
                  mb-6"
                >

                  {note.title}

                </h2>

                <div
                  className="
                  space-y-2
                  text-gray-400
                  mb-8"
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

                <a
                  href={resolvePdfUrl(note.pdf_url)}
                  target="_blank"
                  className="
                  block
                  text-center
                  py-4
                  rounded-2xl
                  bg-blue-600
                  hover:bg-blue-500"
                >

                  Open PDF

                </a>

              </motion.div>

            )
          )}

        </div>

      )}

    </main>
  );
}