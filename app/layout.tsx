import "./globals.css";

import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import PageWrapper from "@/components/PageWrapper";

export const metadata = {
  title: "Smart Notes Hub",
  description:
    "Premium Academic Platform for GMRIT Students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <html lang="en">

      <body
        className="
        bg-[#050816]
        text-white
        overflow-x-hidden"
      >

        <Navbar />

        {/* GLOBAL PAGE ANIMATION */}
        <PageWrapper>

          {children}

        </PageWrapper>

        {/* GLOBAL FOOTER */}
        <Reveal>

          <footer
            className="
            relative
            border-t
            border-white/10
            py-20
            text-center
            overflow-hidden"
          >

            <div
              className="
              absolute
              inset-0
              bg-gradient-to-r
              from-blue-500/5
              via-cyan-500/5
              to-blue-500/5"
            />

            <div className="relative z-10">

              <h2
                className="
                text-5xl
                font-black
                text-blue-500"
              >

                Smart Notes Hub

              </h2>

              <p
                className="
                text-gray-400
                mt-6
                text-lg"
              >

                Made by Sravani |

                <a
                  href="https://www.linkedin.com/in/sravani-m-25a53b33a/"
                  target="_blank"
                  className="
                  text-blue-400
                  ml-2
                  hover:text-blue-300
                  transition"
                >

                  LinkedIn

                </a>

              </p>

            </div>

          </footer>

        </Reveal>

      </body>

    </html>
  );
}