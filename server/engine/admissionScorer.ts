import { EvaluatedCriterion } from "./types.js";

export interface AdmissionDecision {
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  admissionRecommended: boolean;
}

export function computeAdmissionDecision(
  evaluated: EvaluatedCriterion[],
): AdmissionDecision {
  const totalScore = evaluated.reduce((sum, c) => sum + c.scoreContribution, 0);
  const maxPossibleScore = evaluated.length * 5;

  const percentage =
    maxPossibleScore > 0
      ? Math.round((totalScore / maxPossibleScore) * 100)
      : 0;

  const admissionRecommended = evaluated.some((c) => c.status === "Met");

  return {
    totalScore,
    maxPossibleScore,
    percentage,
    admissionRecommended,
  };
}

