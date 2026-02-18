import { parsePdfSections } from "./pdfSectionParser.js";
import { extractCriteria } from "./criteriaExtractor.js";
import { extractClinicalData } from "./clinicalExtractor.js";
import { evaluateCriteria } from "./criteriaEvaluator.js";
import { buildJustification } from "./justificationBuilder.js";
import { computeAdmissionDecision } from "./admissionScorer.js";
import {
  ExtractedCriterion,
  EvaluatedCriterion,
  AlignmentResult,
} from "./types.js";

export function runAlignmentEngine(
  doctorNotes: string,
  pdfText: string,
  referenceNotes?: string,
): AlignmentResult {
  const sections = parsePdfSections(pdfText);

  const criteria: ExtractedCriterion[] = extractCriteria(sections);

  const clinicalData = extractClinicalData(doctorNotes);

  const evaluated: EvaluatedCriterion[] = evaluateCriteria(
    criteria,
    clinicalData,
  );

  const decision = computeAdmissionDecision(evaluated);

  const revisedNotes = buildJustification(clinicalData, evaluated, decision);

  return {
    extractedCriteria: criteria,
    revisedNotes,
    missingCriteria: evaluated.filter((c) => c.status !== "Met"),
    overallScore: decision.percentage,
    admissionRecommended: decision.admissionRecommended,
  };
}

