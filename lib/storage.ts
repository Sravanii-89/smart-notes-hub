import { supabase } from "@/lib/supabase";

export const NOTES_BUCKET = "notes-pdfs";

/** Object path inside the bucket (no leading slash). */
export function buildStoragePath(fileName: string): string {
  return `uploads/${fileName}`;
}

export function getPublicPdfUrl(storagePath: string): string {
  const { data } = supabase.storage
    .from(NOTES_BUCKET)
    .getPublicUrl(storagePath);

  return data.publicUrl;
}

/**
 * Resolves pdf_url from DB — supports bare paths (uploads/foo.pdf)
 * or full Supabase public URLs from older rows.
 */
export function extractObjectPath(pdfUrl: string): string | null {
  if (!pdfUrl?.trim()) {
    return null;
  }

  const trimmed = pdfUrl.trim();

  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return trimmed.replace(/^\/+/, "");
  }

  try {
    const url = new URL(trimmed);
    const bucketMarkers = [
      `/object/public/${NOTES_BUCKET}/`,
      `/object/public/notes-pdfs/`,
      `/object/sign/${NOTES_BUCKET}/`,
      `/object/authenticated/${NOTES_BUCKET}/`,
    ];

    for (const marker of bucketMarkers) {
      const idx = url.pathname.indexOf(marker);
      if (idx !== -1) {
        return decodeURIComponent(
          url.pathname.slice(idx + marker.length).split("?")[0]
        );
      }
    }

    const legacyMatch = url.pathname.match(
      /\/storage\/v1\/object\/public\/[^/]+\/(.+)$/
    );
    if (legacyMatch?.[1]) {
      return decodeURIComponent(legacyMatch[1]);
    }
  } catch {
    return null;
  }

  return null;
}

export function candidateStoragePaths(objectPath: string): string[] {
  const normalized = objectPath.replace(/^\/+/, "");
  const fileName = normalized.split("/").pop();

  if (!fileName) {
    return [normalized];
  }

  const paths = new Set<string>([
    normalized,
    buildStoragePath(fileName),
    fileName,
  ]);

  if (normalized.startsWith("uploads/")) {
    paths.add(normalized.slice("uploads/".length));
  }

  return [...paths];
}

export function getPdfProxyHref(
  pdfUrl: string,
  download = false
): string {
  const objectPath = extractObjectPath(pdfUrl);
  if (!objectPath) {
    return pdfUrl;
  }

  const href = `/api/pdf?path=${encodeURIComponent(objectPath)}`;
  return download ? `${href}&download=1` : href;
}

export function resolvePdfUrl(
  pdfUrl: string,
  download = false
): string {
  return getPdfProxyHref(pdfUrl, download);
}

export async function uploadNotePdf(
  file: File,
  fileName: string
): Promise<{ storagePath: string } | { error: string }> {
  const uploadOptions = {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type || "application/pdf",
  };

  const storagePath = buildStoragePath(fileName);

  const { error: folderError } = await supabase.storage
    .from(NOTES_BUCKET)
    .upload(storagePath, file, uploadOptions);

  if (!folderError) {
    return { storagePath };
  }

  const { error: rootError } = await supabase.storage
    .from(NOTES_BUCKET)
    .upload(fileName, file, uploadOptions);

  if (!rootError) {
    return { storagePath: fileName };
  }

  return {
    error:
      rootError.message ||
      folderError.message ||
      "Failed to upload PDF to storage.",
  };
}
