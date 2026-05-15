import { Suspense } from "react";
import UploadPageContent from "./UploadPageContent";

export const dynamic = "force-dynamic";

export default function UploadPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white text-xl">
          Loading upload form...
        </div>
      }
    >
      <UploadPageContent />
    </Suspense>
  );
}
