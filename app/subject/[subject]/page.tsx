import { Suspense } from "react";
import SubjectPageContent from "./SubjectPageContent";

export default function SubjectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-white text-xl">
          Loading subject...
        </div>
      }
    >
      <SubjectPageContent />
    </Suspense>
  );
}
