"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

const branches = [
  "First Year",
  "CSE",
  "IT",
  "ECE",
  "EEE",
  "MECH",
  "CIVIL",
];

const years = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
];

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!title || !subject || !branch || !year || !file) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("notes-pdfs")
        .upload(`uploads/${fileName}`, file);

      if (uploadError) {
        alert(uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("notes-pdfs")
        .getPublicUrl(`uploads/${fileName}`);

      const pdfUrl = data.publicUrl;

      const { error: insertError } = await supabase
        .from("notes")
        .insert([
          {
            title,
            subject,
            branch,
            year,
            pdf_url: pdfUrl,
            uploaded_by: "Sravani",
          },
        ]);

      if (insertError) {
        alert(insertError.message);
        setLoading(false);
        return;
      }

      alert("Notes uploaded successfully 🚀");

      setTitle("");
      setSubject("");
      setBranch("");
      setYear("");
      setFile(null);

      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("Upload failed");
      setLoading(false);
    }
  }

  return (
    <main
      className="
      min-h-screen
      relative
      overflow-hidden
      px-6
      md:px-16
      pt-40
      pb-20
      bg-[#050816]
      text-white"
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
            text-5xl
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
            onChange={(e) => setTitle(e.target.value)}
            className="
            w-full
            rounded-2xl
            bg-black/30
            border
            border-white/10
            px-6
            py-5
            text-xl
            outline-none"
          />

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="
            w-full
            rounded-2xl
            bg-black/30
            border
            border-white/10
            px-6
            py-5
            text-xl
            outline-none"
          />

          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
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
            <option value="">Select Branch</option>

            {branches.map((branch) => (
              <option
                key={branch}
                value={branch}
              >
                {branch}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
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
            <option value="">Select Year</option>

            {years.map((year) => (
              <option
                key={year}
                value={year}
              >
                {year}
              </option>
            ))}
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
                setFile(e.target.files?.[0] || null)
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
            {loading ? "Uploading..." : "Upload Notes"}
          </motion.button>
        </div>
      </motion.div>
    </main>
  );
}