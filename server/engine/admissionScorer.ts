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

  const maxPossibleScore = evaluated.length * 10;

  const percentage =
    maxPossibleScore > 0
      ? Math.round((totalScore / maxPossibleScore) * 100)
      : 0;

  const admissionRecommended = percentage >= 60;

  return {
    totalScore,
    maxPossibleScore,
    percentage,
    admissionRecommended,
  };
}
