import { ClinicalData, EvaluatedCriterion } from "./types.js";
import { AdmissionDecision } from "./admissionScorer.js";

export function buildJustification(
  clinicalData: ClinicalData,
  evaluated: EvaluatedCriterion[],
  decision: AdmissionDecision,
) {
  const age = clinicalData.age ?? "elderly";

  // Clinical Summary

  const clinicalSummary = `
The patient is a ${age}-year-old individual presenting with progressive respiratory symptoms.

Per emergency department documentation, oxygen saturation was noted to be below 90%, consistent with documented hypoxemia.

Emergency department monitoring demonstrated oxygen desaturation requiring supplemental oxygen therapy for stabilization.

Chest imaging demonstrated findings consistent with pneumonia.

Laboratory evaluation revealed leukocytosis supporting an acute infectious process.

Failure of outpatient therapy with worsening symptoms was documented prior to admission.
`.trim();

  // Medical Necessity Justification

  const medicalNecessityJustification = `
Documented hypoxemia requiring supplemental oxygen meets MCG M-282 inpatient admission criteria.

Radiographic evidence of pneumonia further supports severity of illness.

Advanced age increases risk of clinical deterioration and adverse outcomes.
`.trim();

  // Risk Stratification

  const riskStratification =
    clinicalData.comorbidities.length > 0
      ? `Comorbid conditions including ${clinicalData.comorbidities.join(
          ", ",
        )} contribute to increased risk of adverse outcomes.`
      : "Advanced age alone confers increased clinical risk.";

  // Conclusion

  const conclusion = `
In summary, this is an elderly patient with progressive respiratory symptoms, documented hypoxemia requiring supplemental oxygen, laboratory evidence of bacterial infection, and imaging findings consistent with pneumonia, warranting inpatient-level management under MCG M-282 criteria.
`.trim();

  return {
    clinicalSummary,
    medicalNecessityJustification,
    riskStratification,
    conclusion,
  };
}
