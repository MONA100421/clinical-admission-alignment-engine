import { ClinicalData } from "./types.js";

export function extractClinicalData(notes: string): ClinicalData {
  const lower = notes.toLowerCase();

  // AGE
  const ageMatch = lower.match(/(\d{2,3})-year-old/);
  const age = ageMatch ? parseInt(ageMatch[1]) : undefined;

  // WBC
  const wbcMatch = lower.match(/wbc\s*[:=]?\s*(\d+\.?\d*)/);
  const wbc = wbcMatch ? parseFloat(wbcMatch[1]) : undefined;

  // SpO2
  const spo2Matches = [
    ...lower.matchAll(/(oxygen saturation|o2 sat|spo2)[^\d]*(\d{2,3})/g),
  ];
  let spo2: number | undefined;

  if (spo2Matches.length > 0) {
    const values = spo2Matches.map((m) => parseInt(m[2]));
    spo2 = Math.min(...values);
  }

  const hypoxemia = spo2 !== undefined && spo2 < 90;

  // Oxygen Requirement
  const oxygenRequirement =
    hypoxemia ||
    lower.includes("nasal cannula") ||
    lower.includes("supplemental oxygen") ||
    lower.includes("oxygen via") ||
    lower.includes("on 2 l") ||
    lower.includes("on 4 l") ||
    lower.includes("requires oxygen");

  // Imaging
  const imagingFindings =
    lower.includes("pneumonia") ||
    lower.includes("infiltrate") ||
    lower.includes("infiltrates")
      ? ["radiographic pneumonia"]
      : [];

  // Outpatient Failure
  const outpatientFailure =
    lower.includes("failed outpatient") ||
    lower.includes("after taking two doses") ||
    lower.includes("no improvement after") ||
    lower.includes("worsened despite treatment");

  // Comorbidities
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
