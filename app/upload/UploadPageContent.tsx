"use client";

export const dynamic = "force-dynamic";
import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import { supabase } from "@/lib/supabase";

import { motion } from "framer-motion";

const branches = [
  "CSE",
  "IT",
  "ECE",
  "EEE",
  "MECH",
  "CIVIL",
  "firstYear",
];

const years = [
  "firstYear",
  "secondYear",
  "thirdYear",
  "fourthYear",
];

export default function UploadPageContent() {

  const searchParams =
    useSearchParams();

  const [title, setTitle] =
    useState("");

  const [subject, setSubject] =
    useState("");

  const [branch, setBranch] =
    useState("");

  const [year, setYear] =
    useState("");

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [summary, setSummary] =
    useState("");

  useEffect(() => {

    const s =
      searchParams.get("subject");

    const b =
      searchParams.get("branch");

    const y =
      searchParams.get("year");

    if (s) setSubject(s);
    if (b) setBranch(b);
    if (y) setYear(y);

  }, []);

  async function handleUpload() {

    if (
      !title ||
      !subject ||
      !branch ||
      !year ||
      !file
    ) {

      alert(
        "Please fill all fields."
      );

      return;
    }

    setLoading(true);

    /* FILE UPLOAD */
    const fileName =
      `${Date.now()}-${file.name}`;

    const {
      error: uploadError,
    } = await supabase.storage
      .from("notes-pdfs")
      .upload(
        fileName,
        file
      );

    if (uploadError) {

      alert(
        uploadError.message
      );

      setLoading(false);

      return;
    }

    const {
      data: publicUrlData,
    } = supabase.storage
      .from("notes-pdfs")
      .getPublicUrl(fileName);

    const pdfUrl =
      publicUrlData.publicUrl;

    /* SAVE NOTE */
    const {
      error: insertError,
    } = await supabase
      .from("notes")
      .insert([
        {
          title,
          subject,
          branch,
          year,
          pdf_url: pdfUrl,
          uploaded_by:
            "Sravani",
        },
      ]);

    if (insertError) {

      alert(
        insertError.message
      );

      setLoading(false);

      return;
    }

    /* AI SUMMARY */
    const aiResponse =
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
Title: ${title}

Subject: ${subject}

Branch: ${branch}

Year: ${year}

Generate academic summary for these engineering notes.
`,
          }),

        }
      );

    const aiData =
      await aiResponse.json();

    setSummary(
      aiData.summary
    );

    alert(
      "Notes uploaded successfully 🚀"
    );

    setLoading(false);
  }

  return (

    <main
      className="
      min-h-screen
      relative
      overflow-hidden
      px-6
      py-32"
    >

      {/* BACKGROUND */}
      <div
        className="
        absolute
        top-[-200px]
        right-[-100px]
        w-[500px]
        h-[500px]
        bg-blue-500/10
        rounded-full
        blur-[180px]"
      />

      <div
        className="
        absolute
        bottom-[-250px]
        left-[-150px]
        w-[600px]
        h-[600px]
        bg-cyan-500/10
        rounded-full
        blur-[180px]"
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 50,
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
        max-w-3xl
        mx-auto"
      >

        {/* HEADER */}
        <div className="mb-14">

          <p
            className="
            uppercase
            tracking-[0.4em]
            text-blue-400
            text-sm
            mb-6"
          >

            AI Academic Upload

          </p>

          <h1
            className="
            text-6xl
            md:text-7xl
            font-black"
          >

            Upload

            <span
              className="
              block
              text-blue-500"
            >

              Notes

            </span>

          </h1>

        </div>

        {/* FORM */}
        <div
          className="
          rounded-[40px]
          border
          border-white/10
          bg-white/[0.03]
          backdrop-blur-2xl
          p-10
          space-y-8"
        >

          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            className="
            w-full
            rounded-2xl
            bg-black/30
            border
            border-white/10
            px-6
            py-5
            text-xl
            outline-none
            focus:border-blue-500"
          />

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) =>
              setSubject(
                e.target.value
              )
            }
            className="
            w-full
            rounded-2xl
            bg-black/30
            border
            border-white/10
            px-6
            py-5
            text-xl
            outline-none
            focus:border-blue-500"
          />

          <select
            value={branch}
            onChange={(e) =>
              setBranch(
                e.target.value
              )
            }
            className="
            w-full
            rounded-2xl
            bg-black/30
            border
            border-white/10
            px-6
            py-5
            text-xl"
          >

            <option value="">
              Select Branch
            </option>

            {branches.map(
              (branch) => (

                <option
                  key={branch}
                  value={branch}
                >

                  {branch}

                </option>

              )
            )}

          </select>

          <select
            value={year}
            onChange={(e) =>
              setYear(
                e.target.value
              )
            }
            className="
            w-full
            rounded-2xl
            bg-black/30
            border
            border-white/10
            px-6
            py-5
            text-xl"
          >

            <option value="">
              Select Year
            </option>

            {years.map(
              (year) => (

                <option
                  key={year}
                  value={year}
                >

                  {year}

                </option>

              )
            )}

          </select>

          {/* FILE */}
          <div
            className="
            border-2
            border-dashed
            border-white/10
            rounded-[30px]
            p-12
            text-center
            bg-black/20"
          >

            <input
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setFile(
                  e.target.files?.[0] ||
                    null
                )
              }
              className="text-gray-400"
            />

          </div>

          {/* BUTTON */}
          <motion.button
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={handleUpload}
            disabled={loading}
            className="
            w-full
            py-5
            rounded-2xl
            bg-blue-600
            hover:bg-blue-500
            text-xl
            font-bold
            shadow-[0_0_40px_rgba(37,99,235,0.35)]"
          >

            {loading
              ? "Uploading..."
              : "Upload + Generate AI Summary"}

          </motion.button>

        </div>

        {/* AI SUMMARY */}
        {summary && (

          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
            mt-12
            rounded-[40px]
            border
            border-blue-500/20
            bg-blue-500/5
            backdrop-blur-2xl
            p-10"
          >

            <h2
              className="
              text-4xl
              font-black
              text-blue-400
              mb-8"
            >

              AI Summary 🤖

            </h2>

            <div
              className="
              whitespace-pre-wrap
              text-lg
              text-gray-300
              leading-relaxed"
            >

              {summary}

            </div>

          </motion.div>

        )}

      </motion.div>

    </main>
  );
}