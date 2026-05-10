"use client";

import Link from "next/link";

import {
  Menu,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

export default function Navbar() {

  const [open, setOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  useEffect(() => {

    function handleScroll() {

      setScrolled(
        window.scrollY > 30
      );
    }

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);

  const navItems = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Notes",
      href: "/notes",
    },
    {
      name: "Upload",
      href: "/upload",
    },
    {
      name: "Dashboard",
      href: "/dashboard",
    },
    {
      name: "Saved",
      href: "/saved",
    },
  ];

  return (

    <motion.nav
      initial={{
        y: -80,
      }}
      animate={{
        y: 0,
      }}
      transition={{
        duration: 0.8,
      }}
      className={`
      fixed
      top-0
      left-0
      w-full
      z-50
      transition-all
      duration-500

      ${
        scrolled
          ? `
          backdrop-blur-2xl
          bg-[#050816]/70
          border-b
          border-white/10`
          : "bg-transparent"
      }
      `}
    >

      <div
        className="
        max-w-7xl
        mx-auto
        px-6
        py-5
        flex
        items-center
        justify-between"
      >

        {/* LOGO */}
        <Link href="/">

          <motion.div
            whileHover={{
              scale: 1.03,
            }}
            className="cursor-pointer"
          >

            <h1
              className="
              text-4xl
              font-black
              leading-none"
            >

              <span className="text-white">

                Smart

              </span>

              <span className="text-blue-500">

                Notes

              </span>

            </h1>

            <p
              className="
              text-gray-500
              text-sm
              mt-1"
            >

              Premium Academic Platform

            </p>

          </motion.div>

        </Link>

        {/* DESKTOP NAV */}
        <div
          className="
          hidden
          md:flex
          items-center
          gap-10"
        >

          {navItems.map((item) => (

            <Link
              key={item.name}
              href={item.href}
              className="
              relative
              text-lg
              text-gray-300
              hover:text-white
              transition
              group"
            >

              {item.name}

              <span
                className="
                absolute
                left-0
                -bottom-2
                w-0
                h-[2px]
                bg-blue-500
                transition-all
                duration-300
                group-hover:w-full"
              />

            </Link>

          ))}

          {/* LOGIN BUTTON */}
          <Link href="/login">

            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="
              px-7
              py-3
              rounded-2xl
              bg-blue-600
              hover:bg-blue-500
              font-semibold
              shadow-[0_0_35px_rgba(37,99,235,0.35)]
              transition"
            >

              Login

            </motion.button>

          </Link>

        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() =>
            setOpen(!open)
          }
          className="
          md:hidden
          text-white"
        >

          {open ? (

            <X size={32} />

          ) : (

            <Menu size={32} />

          )}

        </button>

      </div>

      {/* MOBILE MENU */}
      {open && (

        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
          md:hidden
          px-6
          pb-8
          backdrop-blur-2xl
          bg-[#050816]/90
          border-t
          border-white/10"
        >

          <div
            className="
            flex
            flex-col
            gap-6
            text-xl"
          >

            {navItems.map((item) => (

              <Link
                key={item.name}
                href={item.href}
                onClick={() =>
                  setOpen(false)
                }
                className="
                text-gray-300
                hover:text-blue-400
                transition"
              >

                {item.name}

              </Link>

            ))}

            <Link
              href="/login"
              onClick={() =>
                setOpen(false)
              }
            >

              <button
                className="
                mt-4
                w-full
                py-4
                rounded-2xl
                bg-blue-600
                font-semibold"
              >

                Login

              </button>

            </Link>

          </div>

        </motion.div>

      )}

    </motion.nav>
  );
}