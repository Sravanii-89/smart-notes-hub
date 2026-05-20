import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import {
  NOTES_BUCKET,
  candidateStoragePaths,
  getPublicPdfUrl,
} from "@/lib/storage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function findPathByListing(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  fileName: string
): Promise<string | null> {
  const folders = ["uploads", ""];

  for (const folder of folders) {
    const { data, error } = await supabase.storage
      .from(NOTES_BUCKET)
      .list(folder || undefined, {
        limit: 100,
        search: fileName,
      });

    if (error || !data?.length) {
      continue;
    }

    const match = data.find(
      (item: { name: string }) => item.name === fileName
    );
    if (match) {
      return folder ? `${folder}/${match.name}` : match.name;
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  const rawPath = request.nextUrl.searchParams.get("path");
  const asDownload = request.nextUrl.searchParams.get("download") === "1";

  if (!rawPath) {
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
  const decodedPath = decodeURIComponent(rawPath);
  let pathsToTry = candidateStoragePaths(decodedPath);

  const fileName = decodedPath.split("/").pop();
  if (fileName) {
    const listed = await findPathByListing(supabase, fileName);
    if (listed) {
      pathsToTry = [
        listed,
        ...pathsToTry.filter((p) => p !== listed),
      ];
    }
  }

  const errors: string[] = [];

  for (const path of pathsToTry) {
    const { data, error } = await supabase.storage
      .from(NOTES_BUCKET)
      .download(path);

    if (!error && data) {
      const bytes = await data.arrayBuffer();
      const safeName = (path.split("/").pop() ?? "notes.pdf").replace(
        /[^\w.\-()]/g,
        "_"
      );

      return new NextResponse(bytes, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `${asDownload ? "attachment" : "inline"}; filename="${safeName}"`,
          "Cache-Control": "private, max-age=3600",
        },
      });
    }

    if (error) {
      errors.push(`${path}: ${error.message}`);
    }
  }

  for (const path of pathsToTry) {
    try {
      const publicUrl = getPublicPdfUrl(path);
      const response = await fetch(publicUrl);

      if (response.ok) {
        const bytes = await response.arrayBuffer();
        const safeName = (path.split("/").pop() ?? "notes.pdf").replace(
          /[^\w.\-()]/g,
          "_"
        );

        return new NextResponse(bytes, {
          status: 200,
          headers: {
            "Content-Type":
              response.headers.get("content-type") ?? "application/pdf",
            "Content-Disposition": `${asDownload ? "attachment" : "inline"}; filename="${safeName}"`,
            "Cache-Control": "private, max-age=3600",
          },
        });
      }

      errors.push(`${path} (public): HTTP ${response.status}`);
    } catch (fetchError) {
      errors.push(
        `${path} (public): ${fetchError instanceof Error ? fetchError.message : "fetch failed"}`
      );
    }
  }

  return NextResponse.json(
    {
      error: "PDF not found in storage.",
      triedPaths: pathsToTry,
      details: errors,
    },
    { status: 404 }
  );
}
