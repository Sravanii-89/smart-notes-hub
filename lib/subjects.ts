import { subjectsData } from "@/data/subjects";

export type BranchKey = keyof typeof subjectsData;

export function subjectToSlug(subject: string): string {
  return subject
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-");
}

export function slugToDisplayName(slug: string): string {
  const decoded = decodeURIComponent(slug).toLowerCase();

  for (const branchData of Object.values(subjectsData)) {
    const subjects = Array.isArray(branchData)
      ? branchData
      : Object.values(branchData).flat();

    for (const name of subjects) {
      if (subjectToSlug(name) === decoded) {
        return name;
      }
    }
  }

  return decodeURIComponent(slug)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function normalizeBranchParam(branch: string): BranchKey | null {
  if (branch === "firstYear" || branch.toLowerCase() === "firstyear") {
    return "firstYear";
  }

  const upper = branch.toUpperCase();
  if (upper in subjectsData) {
    return upper as BranchKey;
  }

  if (branch in subjectsData) {
    return branch as BranchKey;
  }

  return null;
}

export function isFirstYearBranch(branch: string): boolean {
  return normalizeBranchParam(branch) === "firstYear";
}

export function getYearsForBranch(branch: string): string[] {
  const key = normalizeBranchParam(branch);
  if (!key || key === "firstYear") {
    return [];
  }

  const data = subjectsData[key];
  if (Array.isArray(data)) {
    return [];
  }

  return Object.keys(data);
}

export function getSubjectsForBranchYear(
  branch: string,
  year: string
): string[] {
  const key = normalizeBranchParam(branch);
  if (!key) {
    return [];
  }

  const data = subjectsData[key];

  if (Array.isArray(data)) {
    return data;
  }

  const yearSubjects = data[year as keyof typeof data];
  return Array.isArray(yearSubjects) ? yearSubjects : [];
}

export function formatYearLabel(year: string): string {
  return year.replace(/([A-Z])/g, " $1").trim();
}

export function subjectPageHref(
  subject: string,
  branch: string,
  year: string
): string {
  return `/subject/${subjectToSlug(subject)}?branch=${encodeURIComponent(branch)}&year=${encodeURIComponent(year)}`;
}
