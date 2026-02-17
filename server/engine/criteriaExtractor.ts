import { ExtractedCriterion, CriterionCategory } from "./types.js";

interface PdfSections {
  admissionCriteria?: string[];
  [key: string]: string[] | undefined;
}

export function extractCriteria(sections: PdfSections): ExtractedCriterion[] {
  const lines: string[] = sections.admissionCriteria ?? [];

  return lines
    .filter((line: string) => line.length > 30)
    .map((line: string, index: number) => ({
      id: `C${index + 1}`,
      text: line,
      category: classifyCriterion(line),
    }));
}

function classifyCriterion(text: string): CriterionCategory {
  if (/oxygen|hypox|saturation/i.test(text)) return "Respiratory";
  if (/imaging|x-ray|ct/i.test(text)) return "Imaging";
  if (/lab|wbc|blood/i.test(text)) return "Laboratory";
  if (/outpatient|failed/i.test(text)) return "Outpatient";
  if (/comorbid|risk/i.test(text)) return "Comorbidity";
  return "General";
}
