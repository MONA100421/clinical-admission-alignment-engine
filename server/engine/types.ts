export type CriterionCategory =
  | "Respiratory"
  | "Imaging"
  | "Laboratory"
  | "Outpatient"
  | "Comorbidity"
  | "General";

export interface ExtractedCriterion {
  id: string;
  text: string;
  category: CriterionCategory;
}

export interface ClinicalData {
  age?: number;
  symptoms: string[];
  vitals: Record<string, number>;
  labs: Record<string, number>;
  imagingFindings: string[];
  oxygenRequirement: boolean;
  hypoxemia: boolean;
  comorbidities: string[];
  outpatientFailure: boolean;
}

export interface AlignmentResult {
  extractedCriteria: ExtractedCriterion[];
  revisedNotes: {
    clinicalSummary: string;
    medicalNecessityJustification: string;
    riskStratification: string;
    conclusion: string;
  };
  missingCriteria: EvaluatedCriterion[];
  overallScore: number;
  admissionRecommended: boolean;
}

export interface EvaluatedCriterion {
  criterionId: string;
  criterionText: string;
  category: CriterionCategory;
  status: "Met" | "Partially Met" | "Missing";
  evidenceFound: string;
  suggestedLanguage: string;
  scoreContribution: number;
}

