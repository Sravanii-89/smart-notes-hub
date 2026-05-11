"use client";

export const dynamic = "force-dynamic";

import {
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import {
  motion,
} from "framer-motion";

const branches = [
  "firstYear",
  "CSE",
  "IT",
  "ECE",
  "EEE",
  "MECH",
  "CIVIL",
];

const years = [
  "firstYear",
  "secondYear",
  "thirdYear",
  "fourthYear",
];

export default function UploadPage() {

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

  async function handleUpload() {

    if (
      !title ||
      !subject ||
      !branch ||
      !year ||
      !file
    ) {

      alert(
        "Please fill all fields"
      );

}