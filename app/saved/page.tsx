"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SavedPage() {

  const [savedNotes, setSavedNotes] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchSavedNotes();

  }, []);

  async function fetchSavedNotes() {

    try {

      const {
        data: savedData,
        error: savedError,
      } = await supabase
        .from("saved_notes")
        .select("*");

      if (savedError) {

        console.log(savedError);

        setLoading(false);

        return;
      }

      if (!savedData || savedData.length === 0) {

        setSavedNotes([]);

        setLoading(false);

        return;
      }

      const noteIds =
        savedData.map(
          (item) => item.note_id
        );

      const {
        data: notesData,
        error: notesError,
      } = await supabase
        .from("notes")
        .select("*")
        .in("id", noteIds);

      if (notesError) {

        console.log(notesError);

        setLoading(false);

        return;
      }

      setSavedNotes(notesData || []);

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);
    }
  }

  return (

    <div
      className="
      min-h-screen
      px-6
      md:px-16
      pt-40
      pb-20"
    >

      <h1
        className="
        text-5xl
        md:text-7xl
        font-black
        text-pink-400
        mb-14"
      >

        Saved Notes ❤️

      </h1>

      {loading ? (

        <h2 className="text-3xl">

          Loading...

        </h2>

      ) : savedNotes.length === 0 ? (

        <div
          className="
          bg-white/5
          border
          border-pink-800
          rounded-3xl
          p-16
          text-center
          backdrop-blur-xl"
        >

          <h2
            className="
            text-4xl
            font-bold
            text-pink-400"
          >

            No Saved Notes Yet

          </h2>

          <p
            className="
            mt-4
            text-xl
            text-gray-400"
          >

            Save notes to access them later.

          </p>

        </div>

      ) : (

        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-10"
        >

          {savedNotes.map((note) => (

            <div
              key={note.id}
              className="
              bg-white/5
              backdrop-blur-xl
              border
              border-blue-900
              rounded-[30px]
              p-8
              shadow-2xl
              hover:scale-105
              transition"
            >

              <h2
                className="
                text-3xl
                font-black
                text-cyan-400
                mb-6"
              >

                {note.title}

              </h2>

              <div className="space-y-3">

                <p className="text-lg">
                  <span className="font-bold">
                    Subject:
                  </span>{" "}
                  {note.subject}
                </p>

                <p className="text-lg">
                  <span className="font-bold">
                    Branch:
                  </span>{" "}
                  {note.branch}
                </p>

                <p className="text-lg">
                  <span className="font-bold">
                    Year:
                  </span>{" "}
                  {note.year}
                </p>

              </div>

              <div
                className="
                flex
                gap-4
                mt-8"
              >

                <a
                  href={note.pdf_url}
                  target="_blank"
                  className="
                  flex-1
                  text-center
                  bg-blue-600
                  hover:bg-blue-700
                  py-4
                  rounded-2xl
                  font-bold
                  transition"
                >

                  Preview

                </a>

                <a
                  href={note.pdf_url}
                  download
                  className="
                  flex-1
                  text-center
                  bg-green-600
                  hover:bg-green-700
                  py-4
                  rounded-2xl
                  font-bold
                  transition"
                >

                  Download

                </a>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}