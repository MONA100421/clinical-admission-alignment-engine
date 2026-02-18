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
    let status: "Met" | "Partially Met" | "Missing" = "Missing";
    let evidence: string[] = [];

    if (criterion.category === "Respiratory") {
      if (clinicalData.hypoxemia) {
        status = "Met";
        evidence.push("Hypoxemia documented.");
      }
    }

    if (criterion.category === "Imaging") {
      if (clinicalData.imagingFindings.length > 0) {
        status = "Met";
        evidence.push("Radiographic pneumonia present.");
      }
    }

    if (criterion.category === "Laboratory") {
      if (clinicalData.labs.wbc && clinicalData.labs.wbc > 11) {
        status = "Partially Met";
        evidence.push("Leukocytosis present.");
      }
    }

    if (criterion.category === "Outpatient") {
      if (clinicalData.outpatientFailure) {
        status = "Met";
        evidence.push("Failure of outpatient therapy documented.");
      }
    }

    if (criterion.category === "Comorbidity") {
      if (clinicalData.comorbidities.length > 0) {
        status = "Partially Met";
        evidence.push("Comorbid risk factors documented.");
      }
    }

    return {
      criterionId: criterion.id,
      criterionText: criterion.text,
      category: criterion.category,
      status,
      evidenceFound: evidence.join(" "),
      suggestedLanguage:
        status === "Missing" ? `Explicitly document: ${criterion.text}` : "",
      scoreContribution:
        status === "Met" ? 5 : status === "Partially Met" ? 2 : 0,
    };
  });
}

