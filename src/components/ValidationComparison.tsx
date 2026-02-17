import React from "react";
import { RevisedNotes } from "@/types/clinical";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ValidationComparisonProps {
  aiNotes: RevisedNotes;
  referenceNotes: string;
}

// UTILITIES 

function computeSimilarity(a: string, b: string): number {
  const wordsA = a.toLowerCase().split(/\s+/).filter(Boolean);
  const wordsB = b.toLowerCase().split(/\s+/).filter(Boolean);

  if (wordsA.length === 0 && wordsB.length === 0) return 100;
  if (wordsA.length === 0 || wordsB.length === 0) return 0;

  const setA = new Set(wordsA);
  const setB = new Set(wordsB);
  const intersection = new Set([...setA].filter((w) => setB.has(w)));
  const union = new Set([...setA, ...setB]);

  return Math.round((intersection.size / union.size) * 100);
}

function highlightDifferences(
  ai: string,
  reference: string,
): React.ReactNode[] {
  const aiWords = ai.split(/\s+/);
  const refSet = new Set(reference.toLowerCase().split(/\s+/));

  return aiWords.map((word, i) => {
    const cleaned = word.toLowerCase().replace(/[.,;:!?]/g, "");
    const isMatch = refSet.has(cleaned);

    return (
      <span key={i} className={isMatch ? "" : "bg-accent font-medium"}>
        {word}{" "}
      </span>
    );
  });
}

// SECTION PARSER

function extractSection(text: string, title: string): string {
  const regex = new RegExp(
    `${title}[\\s\\S]*?(?=(Clinical Summary|Medical Necessity Justification|Risk Stratification|Conclusion|$))`,
    "i",
  );
  const match = text.match(regex);
  return match ? match[0] : "";
}

function parseReferenceSections(reference: string) {
  return {
    clinicalSummary: extractSection(reference, "Clinical Summary"),
    medicalNecessityJustification: extractSection(
      reference,
      "Medical Necessity Justification",
    ),
    riskStratification: extractSection(reference, "Risk Stratification"),
    conclusion: extractSection(reference, "Conclusion"),
  };
}

// COMPONENT

const ValidationComparison: React.FC<ValidationComparisonProps> = ({
  aiNotes,
  referenceNotes,
}) => {
  const refSections = parseReferenceSections(referenceNotes);

  const structuredSections = [
    {
      title: "Clinical Summary",
      ai: aiNotes.clinicalSummary,
      ref: refSections.clinicalSummary,
    },
    {
      title: "Medical Necessity Justification",
      ai: aiNotes.medicalNecessityJustification,
      ref: refSections.medicalNecessityJustification,
    },
    {
      title: "Risk Stratification",
      ai: aiNotes.riskStratification,
      ref: refSections.riskStratification,
    },
    {
      title: "Conclusion",
      ai: aiNotes.conclusion,
      ref: refSections.conclusion,
    },
  ];

  const sectionScores = structuredSections.map((s) =>
    computeSimilarity(s.ai, s.ref),
  );

  const overallSimilarity =
    Math.round(
      sectionScores.reduce((sum, s) => sum + s, 0) / sectionScores.length,
    ) || 0;

  return (
    <ScrollArea className="h-[calc(100vh-320px)]">
      <div className="space-y-4 pr-4">
        {/* Overall Score */}
        <Card>
          <CardContent className="pt-4 flex items-center justify-between">
            <span className="font-semibold">Overall Structured Similarity</span>
            <Badge
              variant="outline"
              className={
                overallSimilarity >= 70
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300 text-lg px-4 py-1"
                  : overallSimilarity >= 40
                    ? "bg-amber-100 text-amber-800 border-amber-300 text-lg px-4 py-1"
                    : "bg-red-100 text-red-800 border-red-300 text-lg px-4 py-1"
              }
            >
              {overallSimilarity}%
            </Badge>
          </CardContent>
        </Card>

        {/* Section-by-section comparison */}
        {structuredSections.map((section, index) => {
          const sectionSim = sectionScores[index];

          return (
            <Card key={section.title}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{section.title}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {sectionSim}% match
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  {highlightDifferences(section.ai, section.ref)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default ValidationComparison;
