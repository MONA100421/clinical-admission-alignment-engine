import { ExtractedCriterion, CriterionCategory } from "./types.js";

interface PdfSections {
  [key: string]: string[];
}

export function extractCriteria(sections: PdfSections): ExtractedCriterion[] {
  const allLines: string[] = Object.values(sections).flat();

  const candidateLines = allLines
    .map((line) => line.trim())
    .filter((line) => line.length > 40)
    .filter((line) =>
      /oxygen|hypox|saturation|imaging|x-ray|ct|lab|wbc|blood|outpatient|failed|comorbid|risk/i.test(
        line,
      ),
    );

  const uniqueLines = Array.from(new Set(candidateLines));

  const selected = uniqueLines.slice(0, 10);

  return selected.map((line, index) => ({
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
