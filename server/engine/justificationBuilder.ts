import { ClinicalData, EvaluatedCriterion } from "./types.js";
import { AdmissionDecision } from "./admissionScorer.js";

export function buildJustification(
  clinicalData: ClinicalData,
  evaluated: EvaluatedCriterion[],
  decision: AdmissionDecision,
) {
  const met = evaluated.filter((c) => c.status === "Met");
  const partial = evaluated.filter((c) => c.status === "Partially Met");

  const summaryLines: string[] = [];

  // Criterion-driven generation
  for (const criterion of met) {
    summaryLines.push(
      `Admission criteria met: ${criterion.category} criteria satisfied.`,
    );
  }

  if (clinicalData.hypoxemia) {
    summaryLines.push(
      "Hypoxemia documented with oxygen saturation below admission threshold.",
    );
  }

  if (clinicalData.oxygenRequirement) {
    summaryLines.push("Patient requires supplemental oxygen therapy.");
  }

  if (clinicalData.imagingFindings.length > 0) {
    summaryLines.push(
      "Imaging findings consistent with acute pulmonary pathology.",
    );
  }

  if (Object.keys(clinicalData.labs).length > 0) {
    summaryLines.push("Laboratory abnormalities support clinical severity.");
  }

  if (clinicalData.outpatientFailure) {
    summaryLines.push("Failure of outpatient therapy documented.");
  }

  const clinicalSummary = summaryLines.join(" ");

  const medicalNecessityJustification = decision.admissionRecommended
    ? `Structured alignment score ${decision.percentage}% supports inpatient admission based on guideline criteria.`
    : `Alignment score ${decision.percentage}% insufficient for inpatient admission under current documentation.`;

  const riskStratification =
    clinicalData.comorbidities.length > 0
      ? `Comorbidities (${clinicalData.comorbidities.join(
          ", ",
        )}) increase risk of deterioration.`
      : "No significant comorbid risk factors documented.";

  const conclusion = decision.admissionRecommended
    ? "Deterministic guideline alignment supports inpatient admission."
    : "Additional documentation required to meet admission criteria.";

  return {
    clinicalSummary,
    medicalNecessityJustification,
    riskStratification,
    conclusion,
  };
}
