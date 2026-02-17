import React from "react";
import { RevisedNotes } from "@/types/clinical";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ValidationComparisonProps {
  aiNotes: RevisedNotes;
  referenceNotes: string;
}

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
    const isMatch = refSet.has(word.toLowerCase().replace(/[.,;:!?]/g, ""));
    return (
      <span key={i} className={isMatch ? "" : "bg-accent font-medium"}>
        {word}{" "}
      </span>
    );
  });
}

const ValidationComparison: React.FC<ValidationComparisonProps> = ({
  aiNotes,
  referenceNotes,
}) => {
  const sections = [
    { title: "Clinical Summary", content: aiNotes.clinicalSummary },
    {
      title: "Medical Necessity Justification",
      content: aiNotes.medicalNecessityJustification,
    },
    { title: "Risk Stratification", content: aiNotes.riskStratification },
    { title: "Conclusion", content: aiNotes.conclusion },
  ];

  const fullAi = sections.map((s) => s.content).join(" ");
  const overallSimilarity = computeSimilarity(fullAi, referenceNotes);

  return (
    <ScrollArea className="h-[calc(100vh-320px)]">
      <div className="space-y-4 pr-4">
        <Card>
          <CardContent className="pt-4 flex items-center justify-between">
            <span className="font-semibold">Overall Similarity Score</span>
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

        {sections.map((section) => {
          const sectionSim = computeSimilarity(section.content, referenceNotes);
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
                  {highlightDifferences(section.content, referenceNotes)}
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
