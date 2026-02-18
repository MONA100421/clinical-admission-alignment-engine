import React, { useState } from "react";
import InputPanel from "@/components/InputPanel";
import OutputPanel from "@/components/OutputPanel";
import StepIndicator from "@/components/StepIndicator";
import { OptimizationResult, ProcessingStep } from "@/types/clinical";
import { extractTextFromPdf } from "@/lib/pdf-parser";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [step, setStep] = useState<ProcessingStep>("idle");
  const [referenceNotes, setReferenceNotes] = useState<string | undefined>();

  const handleOptimize = async (
    doctorNotes: string,
    pdfFile: File,
    refNotes?: string,
  ) => {
    setResult(null);
    setReferenceNotes(refNotes);

    try {
      // Step 1: Parse PDF
      setStep("parsing");
      const pdfText = await extractTextFromPdf(pdfFile);

      if (!pdfText.trim()) {
        toast({
          title: "Error",
          description: "Could not extract text from the PDF.",
          variant: "destructive",
        });
        setStep("error");
        return;
      }

      // Step 2: Extracting
      setStep("extracting");
      await delay(600); // visual feedback

      // Step 3: Matching
      setStep("matching");

      // Step 4: Generating via AI
      setStep("generating");

      const response = await fetch(
        "https://clinical-alignment-backend.onrender.com/api/optimize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doctorNotes,
            pdfText,
            referenceNotes: refNotes,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Processing Error",
          description: data.error || "Failed to process notes.",
          variant: "destructive",
        });
        setStep("error");
        return;
      }

      if (data?.error) {
        toast({
          title: "AI Error",
          description: data.error,
          variant: "destructive",
        });
        setStep("error");
        return;
      }

      setResult(data as OptimizationResult);
      setStep("complete");
      toast({
        title: "Success",
        description: "Documentation optimized successfully.",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      setStep("error");
    }
  };

  const isProcessing = !["idle", "complete", "error"].includes(step);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Clinical Documentation Optimization
            </h1>
            <p className="text-sm text-muted-foreground">
              AHMC AI Test — Chenyi Weng
            </p>
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      {isProcessing && (
        <div className="border-b bg-card">
          <div className="max-w-screen-2xl mx-auto">
            <StepIndicator currentStep={step} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex">
        <div className="max-w-screen-2xl mx-auto flex-1 flex w-full">
          {/* Left Panel - Input */}
          <div className="w-1/2 border-r p-6 overflow-auto">
            <InputPanel
              onOptimize={handleOptimize}
              isProcessing={isProcessing}
            />
          </div>

          {/* Right Panel - Output */}
          <div className="w-1/2 p-6 overflow-auto">
            <OutputPanel result={result} referenceNotes={referenceNotes} />
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="border-t bg-card px-6 py-3">
        <p className="text-center text-xs text-muted-foreground">
          This tool assists clinical documentation and does not replace
          physician judgment.
        </p>
      </footer>
    </div>
  );
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default Index;
