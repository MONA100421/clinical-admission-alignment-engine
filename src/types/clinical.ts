export interface ExtractedCriterion {
  id: string;
  text: string;
  category: string;
}

export interface RevisedNotes {
  clinicalSummary: string;
  medicalNecessityJustification: string;
  riskStratification: string;
  conclusion: string;
}

export interface MissingCriterion {
  criterionId: string;
  criterionText: string;
  status: "Met" | "Partially Met" | "Missing";
  evidenceFound: string;
  suggestedLanguage: string;
  scoreContribution: number;
  maxScore: number;
}

export interface OptimizationResult {
  extractedCriteria: ExtractedCriterion[];
  revisedNotes: RevisedNotes;
  missingCriteria: MissingCriterion[];
  overallScore: number;
  admissionRecommended: boolean;
}

export type ProcessingStep =
  | "idle"
  | "parsing"
  | "extracting"
  | "matching"
  | "generating"
  | "complete"
  | "error";
