import {
  ExtractedCriterion,
  ClinicalData,
  EvaluatedCriterion,
  CriterionCategory,
} from "./types.js";
import { ruleMatrix } from "./ruleMatrix.js";

export function evaluateCriteria(
  criteriaList: ExtractedCriterion[],
  clinicalData: ClinicalData,
): EvaluatedCriterion[] {
  return criteriaList.map((criterion) => {
    let score = 0;
    let evidence: string[] = [];

    const text = criterion.text.toLowerCase();

    if (/oxygen|hypox/.test(text) && clinicalData.hypoxemia) {
      score += 3;
      evidence.push("Hypoxemia documented.");
    }

    if (/imaging|x-ray|ct/.test(text) && clinicalData.imagingFindings.length) {
      score += 2;
      evidence.push("Imaging findings present.");
    }

    if (/lab|wbc/.test(text) && Object.keys(clinicalData.labs).length) {
      score += 2;
      evidence.push("Laboratory abnormalities documented.");
    }

    if (/outpatient|failed/.test(text) && clinicalData.outpatientFailure) {
      score += 2;
      evidence.push("Outpatient therapy failure documented.");
    }

    if (/comorbid|risk/.test(text) && clinicalData.comorbidities.length) {
      score += 1;
      evidence.push("Comorbidities documented.");
    }

    let status: "Met" | "Partially Met" | "Missing" = "Missing";

    if (score >= 3) status = "Met";
    else if (score > 0) status = "Partially Met";

    return {
      criterionId: criterion.id,
      criterionText: criterion.text,
      category: criterion.category,
      status,
      evidenceFound: evidence.join(" "),
      suggestedLanguage:
        status === "Missing" ? `Explicitly document: ${criterion.text}` : "",
      scoreContribution: score,
    };
  });
}

