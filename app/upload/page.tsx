"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import UploadPageContent from "./UploadPageContent";

export default function UploadPage() {
  return (
    <Suspense
      fallback={
        <div
          className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-[#050816]
          text-white"
        >
          <div className="loader" />
        </div>
      }
    >
      <UploadPageContent />
    </Suspense>
  );
}
