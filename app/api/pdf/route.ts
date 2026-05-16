import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import {
  NOTES_BUCKET,
  candidateStoragePaths,
  getPublicPdfUrl,
} from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const objectPath = request.nextUrl.searchParams.get("path");
  const asDownload = request.nextUrl.searchParams.get("download") === "1";

  if (!objectPath) {
    return NextResponse.json(
      { error: "Missing path parameter." },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const pathsToTry = candidateStoragePaths(objectPath);

  for (const path of pathsToTry) {
    const { data, error } = await supabase.storage
      .from(NOTES_BUCKET)
      .createSignedUrl(path, 60 * 60);

    if (!error && data?.signedUrl) {
      return NextResponse.redirect(data.signedUrl);
    }
  }

  for (const path of pathsToTry) {
    const { data, error } = await supabase.storage
      .from(NOTES_BUCKET)
      .download(path);

    if (!error && data) {
      const fileName = path.split("/").pop() ?? "notes.pdf";
      return new NextResponse(data, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `${asDownload ? "attachment" : "inline"}; filename="${fileName}"`,
          "Cache-Control": "private, max-age=3600",
        },
      });
    }
  }

  const publicUrl = getPublicPdfUrl(objectPath);
  const publicCheck = await fetch(publicUrl, { method: "HEAD" });

  if (publicCheck.ok) {
    return NextResponse.redirect(publicUrl);
  }

  return NextResponse.json(
    {
      error:
        "PDF not found. Check Supabase Storage policies for the notes-pdfs bucket (SELECT allowed for uploads/ and root paths).",
      triedPaths: pathsToTry,
    },
    { status: 404 }
  );
}
