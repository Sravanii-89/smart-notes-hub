"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Login successful!");

    router.push("/");
  }

  async function handleSignup() {

    setLoading(true);

    const { error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "Account created! Check email if verification enabled."
    );
  }

  return (

    <div
      className="
      min-h-screen
      bg-black
      text-white
      flex
      items-center
      justify-center
      p-6"
    >

      <form
        onSubmit={handleLogin}
        className="
        bg-[#06143a]
        border
        border-blue-900
        rounded-3xl
        p-12
        w-full
        max-w-xl
        shadow-2xl"
      >

        <h1
          className="
          text-5xl
          font-extrabold
          text-blue-400
          mb-10"
        >

          Login

        </h1>

        <div className="space-y-6">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="
            w-full
            p-5
            rounded-2xl
            bg-black
            border
            border-blue-900
            text-xl"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="
            w-full
            p-5
            rounded-2xl
            bg-black
            border
            border-blue-900
            text-xl"
            required
          />

        </div>

        <div className="flex gap-4 mt-10">

          <button
            type="submit"
            disabled={loading}
            className="
            flex-1
            bg-blue-600
            hover:bg-blue-700
            py-5
            rounded-2xl
            text-2xl
            font-bold"
          >

            {loading
              ? "Please wait..."
              : "Login"}

          </button>

          <button
            type="button"
            onClick={handleSignup}
            disabled={loading}
            className="
            flex-1
            bg-green-600
            hover:bg-green-700
            py-5
            rounded-2xl
            text-2xl
            font-bold"
          >

            Sign Up

          </button>

        </div>

      </form>

    </div>
  );
}