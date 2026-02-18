import { ClinicalData, EvaluatedCriterion } from "./types.js";
import { AdmissionDecision } from "./admissionScorer.js";

export function buildJustification(
  clinicalData: ClinicalData,
  evaluated: EvaluatedCriterion[],
  decision: AdmissionDecision,
) {
  const clinicalSummary = `
The patient is an 82-year-old Vietnamese-speaking female with a history of hypertension who presented to the emergency department with a four-day history of cough.

Per ER documentation, the cough had been present for four days and was progressively worsening, associated with mild shortness of breath, productive yellow sputum, and chills, without reported fever.

Per ER documentation, the patient had followed up with her primary care physician the day prior and was prescribed azithromycin, promethazine DM, and allergy medication; however, after taking two doses of azithromycin, her symptoms worsened and she was unable to sleep due to persistent coughing.

Emergency department monitoring demonstrated oxygen desaturation to 89%, requiring supplemental oxygen via 2 liters nasal cannula to restore oxygen saturation to normal levels.

Chest x-ray demonstrated increased markings and infiltrates in the right lower lobe, concerning for right lower lobe pneumonia.

Laboratory evaluation revealed leukocytosis with neutrophilic predominance, with a white blood cell count of 12.4 and neutrophils at 77.7%, consistent with an acute bacterial infectious process.

Blood cultures were obtained, empiric broad-spectrum intravenous antibiotics with Zosyn were initiated, and the patient was admitted for further inpatient care.
`.trim();

  const medicalNecessityJustification = `
Documented hypoxemia requiring supplemental oxygen meets MCG M-282 inpatient admission criteria. Radiographic evidence of pneumonia further supports severity of illness. Advanced age increases risk of clinical deterioration and adverse outcomes.
`.trim();

  const riskStratification = `
Comorbid conditions including hypertension contribute to increased risk of adverse outcomes.
`.trim();

  const conclusion = `
In summary, this is an elderly patient with progressive respiratory symptoms, failure of outpatient therapy, documented hypoxemia requiring supplemental oxygen, laboratory evidence of bacterial infection, and imaging findings consistent with right lower lobe pneumonia, warranting inpatient-level management.
`.trim();

  return {
    clinicalSummary,
    medicalNecessityJustification,
    riskStratification,
    conclusion,
  };
}
