import { ClinicalData } from "./types.js";

export function extractClinicalData(notes: string): ClinicalData {
  const lower = notes.toLowerCase();

  // AGE
  const ageMatch = lower.match(/(\d{2})-year-old/);
  const age = ageMatch ? parseInt(ageMatch[1]) : undefined;

  // WBC
  const wbcMatch = lower.match(/wbc\s*[:=]?\s*(\d+\.?\d*)/);
  const wbc = wbcMatch ? parseFloat(wbcMatch[1]) : undefined;

  // SpO2
  const spo2Match = lower.match(/(oxygen saturation|spo2)[^\d]*(\d{2})/);
  let spo2: number | undefined;

  if (spo2Match) {
    spo2 = parseInt(spo2Match[2]);
  }

  const hypoxemia = spo2 !== undefined && spo2 < 90;

  const oxygenRequirement =
    lower.includes("nasal cannula") ||
    lower.includes("supplemental oxygen") ||
    lower.includes("placed on 2 l") ||
    lower.includes("placed on 4 l");

  const imagingFindings =
    lower.includes("pneumonia") ||
    lower.includes("infiltrate") ||
    lower.includes("infiltrates")
      ? ["radiographic pneumonia"]
      : [];

  const outpatientFailure =
    lower.includes("failed outpatient") ||
    lower.includes("worsening") ||
    lower.includes("no improvement");

  const comorbidities: string[] = [];

  if (lower.includes("hypertension")) comorbidities.push("hypertension");
  if (lower.includes("afib")) comorbidities.push("atrial fibrillation");
  if (lower.includes("ckd")) comorbidities.push("chronic kidney disease");
  if (lower.includes("nursing home"))
    comorbidities.push("healthcare-associated risk");

  return {
    age,
    symptoms: [],
    vitals: {},
    labs: wbc ? { wbc } : {},
    imagingFindings,
    oxygenRequirement,
    hypoxemia,
    comorbidities,
    outpatientFailure,
  };
}

