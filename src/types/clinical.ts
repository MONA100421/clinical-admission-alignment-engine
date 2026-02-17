export interface ExtractedCriterion {
  id: string;
  criterion: string;
  category: string;
}

export interface RevisedNotes {
  clinicalSummary: string;
  medicalNecessityJustification: string;
  riskStratification: string;
  conclusion: string;
}

export interface MissingCriterion {
  criterion: string;
  status: "Met" | "Partial" | "Missing";
  evidenceFound: string;
  suggestedLanguage: string;
}

export interface OptimizationResult {
  extractedCriteria: ExtractedCriterion[];
  revisedNotes: RevisedNotes;
  missingCriteria: MissingCriterion[];
}

export type ProcessingStep =
  | "idle"
  | "parsing"
  | "extracting"
  | "matching"
  | "generating"
  | "complete"
  | "error";
