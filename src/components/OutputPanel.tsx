import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { OptimizationResult } from "@/types/clinical";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ValidationComparison from "./ValidationComparison";

interface OutputPanelProps {
  result: OptimizationResult | null;
  referenceNotes?: string;
}

const statusColor = (status: string) => {
  switch (status) {
    case "Met":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "Partial":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "Missing":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "";
  }
};

const OutputPanel: React.FC<OutputPanelProps> = ({
  result,
  referenceNotes,
}) => {
  if (!result) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">Page 2 — Output Interface</p>
          <p className="text-sm mt-1">
            Submit input to generate optimized documentation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <h2 className="text-xl font-bold text-foreground">
        Page 2 — Output Interface
      </h2>

      <Tabs defaultValue="revised" className="flex-1 flex flex-col">
        <TabsList className="w-full">
          <TabsTrigger value="revised" className="flex-1">
            Revised Doctor Notes
          </TabsTrigger>
          <TabsTrigger value="missing" className="flex-1">
            Missing Criteria
          </TabsTrigger>
          {referenceNotes && (
            <TabsTrigger value="validation" className="flex-1">
              Validation
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="revised" className="flex-1 mt-4">
          <ScrollArea className="h-[calc(100vh-320px)]">
            <div className="space-y-4 pr-4">
              <Section
                title="Clinical Summary"
                content={result.revisedNotes.clinicalSummary}
              />
              <Section
                title="Medical Necessity Justification"
                content={result.revisedNotes.medicalNecessityJustification}
              />
              <Section
                title="Risk Stratification"
                content={result.revisedNotes.riskStratification}
              />
              <Section
                title="Conclusion"
                content={result.revisedNotes.conclusion}
              />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="missing" className="flex-1 mt-4">
          <ScrollArea className="h-[calc(100vh-320px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Criteria</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead>Evidence Found</TableHead>
                  <TableHead>Suggested Language</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.missingCriteria.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      {item.criterion}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColor(item.status)}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.evidenceFound}
                    </TableCell>
                    <TableCell className="text-sm italic">
                      {item.suggestedLanguage}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </TabsContent>

        {referenceNotes && (
          <TabsContent value="validation" className="flex-1 mt-4">
            <ValidationComparison
              aiNotes={result.revisedNotes}
              referenceNotes={referenceNotes}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

const Section: React.FC<{ title: string; content: string }> = ({
  title,
  content,
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-base">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
    </CardContent>
  </Card>
);

export default OutputPanel;
