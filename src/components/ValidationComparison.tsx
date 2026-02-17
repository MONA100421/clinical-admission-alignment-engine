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
  const clean = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3);

  const wordsA = new Set(clean(a));
  const wordsB = new Set(clean(b));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  const intersection = [...wordsA].filter((w) => wordsB.has(w)).length;

  return Math.round((intersection / wordsB.size) * 100);
}

function highlightDifferences(
  ai: string,
  reference: string,
): React.ReactNode[] {
  const aiWords = ai.split(/\s+/);
  const refSet = new Set(
    reference
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/),
  );

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

// COMPONENT
const ValidationComparison: React.FC<ValidationComparisonProps> = ({
  aiNotes,
  referenceNotes,
}) => {
  const structuredSections = [
    {
      title: "Clinical Summary",
      ai: aiNotes.clinicalSummary,
    },
    {
      title: "Medical Necessity Justification",
      ai: aiNotes.medicalNecessityJustification,
    },
    {
      title: "Risk Stratification",
      ai: aiNotes.riskStratification,
    },
    {
      title: "Conclusion",
      ai: aiNotes.conclusion,
    },
  ];

  const sectionScores = structuredSections.map((section) =>
    computeSimilarity(section.ai, referenceNotes),
  );

  const overallSimilarity =
    Math.round(
      sectionScores.reduce((sum, s) => sum + s, 0) / structuredSections.length,
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
                  {highlightDifferences(section.ai, referenceNotes)}
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
