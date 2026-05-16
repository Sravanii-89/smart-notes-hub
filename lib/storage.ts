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

export function extractObjectPath(pdfUrl: string): string | null {
  if (!pdfUrl) {
    return null;
  }

  try {
    const url = new URL(pdfUrl);

    const markers = [
      `/object/public/${NOTES_BUCKET}/`,
      `/object/sign/${NOTES_BUCKET}/`,
      `/object/authenticated/${NOTES_BUCKET}/`,
    ];

    for (const marker of markers) {
      const idx = url.pathname.indexOf(marker);
      if (idx !== -1) {
        return decodeURIComponent(
          url.pathname.slice(idx + marker.length).split("?")[0]
        );
      }
    }

    const pathParam = url.searchParams.get("path");
    if (pathParam) {
      return decodeURIComponent(pathParam);
    }
  } catch {
    return null;
  }

  return null;
}

/** Paths to try when the stored URL path does not match the real object. */
export function candidateStoragePaths(objectPath: string): string[] {
  const fileName = objectPath.split("/").pop();
  if (!fileName) {
    return [objectPath];
  }

  const paths = new Set<string>([
    objectPath,
    buildStoragePath(fileName),
    fileName,
  ]);

  if (objectPath.startsWith("uploads/")) {
    paths.add(objectPath.slice("uploads/".length));
  }

  return [...paths];
}

/**
 * Opens PDFs through the app proxy so private buckets and path
 * mismatches (root vs uploads/) are handled server-side.
 */
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

export async function getAccessiblePdfUrl(
  pdfUrl: string
): Promise<string> {
  const objectPath = extractObjectPath(pdfUrl);
  if (!objectPath) {
    return pdfUrl;
  }

  for (const path of candidateStoragePaths(objectPath)) {
    const { data, error } = await supabase.storage
      .from(NOTES_BUCKET)
      .createSignedUrl(path, 60 * 60);

    if (!error && data?.signedUrl) {
      return data.signedUrl;
    }
  }

  return getPublicPdfUrl(objectPath);
}

export async function uploadNotePdf(
  file: File,
  fileName: string
): Promise<{ pdfUrl: string; storagePath: string } | { error: string }> {
  const uploadOptions = {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "application/pdf",
  };

  const folderPath = buildStoragePath(fileName);

  const { error: folderError } = await supabase.storage
    .from(NOTES_BUCKET)
    .upload(folderPath, file, uploadOptions);

  if (!folderError) {
    return {
      storagePath: folderPath,
      pdfUrl: getPublicPdfUrl(folderPath),
    };
  }

  const { error: rootError } = await supabase.storage
    .from(NOTES_BUCKET)
    .upload(fileName, file, uploadOptions);

  if (rootError) {
    return {
      error:
        rootError.message ||
        folderError.message ||
        "Failed to upload PDF to storage.",
    };
  }

  return {
    storagePath: fileName,
    pdfUrl: getPublicPdfUrl(fileName),
  };
}
