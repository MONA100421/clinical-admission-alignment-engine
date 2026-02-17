import { ClinicalData } from "./types.js";

export function extractClinicalData(notes: string): ClinicalData {
  const lower = notes.toLowerCase();

  const labs: Record<string, number> = {};
  const wbcMatch = lower.match(/wbc\s*[:=]?\s*(\d+)/);
  if (wbcMatch) labs["wbc"] = parseInt(wbcMatch[1]);

  return {
    symptoms: [
      ...(lower.includes("cough") ? ["cough"] : []),
      ...(lower.includes("shortness of breath") ? ["sob"] : []),
    ],

    vitals: {},

    labs,

    imagingFindings:
      lower.includes("x-ray") || lower.includes("ct")
        ? ["abnormal imaging"]
        : [],

    oxygenRequirement: lower.includes("oxygen"),

    hypoxemia: /o2\s*<\s*90|oxygen\s*saturation\s*<\s*90/.test(lower),

    comorbidities: [
      ...(lower.includes("hypertension") ? ["htn"] : []),
      ...(lower.includes("diabetes") ? ["dm"] : []),
    ],

    outpatientFailure:
      lower.includes("failed outpatient") ||
      lower.includes("no improvement") ||
      lower.includes("worsening"),
  };
}
