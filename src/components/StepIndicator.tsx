import React from "react";
import { ProcessingStep } from "@/types/clinical";
import { CheckCircle2, Loader2, Circle } from "lucide-react";

interface StepIndicatorProps {
  currentStep: ProcessingStep;
}

const steps: { key: ProcessingStep; label: string }[] = [
  { key: "parsing", label: "Parsing Guidelines" },
  { key: "extracting", label: "Extracting Clinical Data" },
  { key: "matching", label: "Matching Criteria" },
  { key: "generating", label: "Generating Output" },
];

const stepOrder: ProcessingStep[] = [
  "parsing",
  "extracting",
  "matching",
  "generating",
  "complete",
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  if (currentStep === "idle") return null;

  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {steps.map((step, i) => {
        const stepIdx = stepOrder.indexOf(step.key);
        const isDone = currentIndex > stepIdx;
        const isActive = currentIndex === stepIdx;

        return (
          <React.Fragment key={step.key}>
            <div className="flex items-center gap-1.5">
              {isDone ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : isActive ? (
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground/40" />
              )}
              <span
                className={`text-xs font-medium ${
                  isDone
                    ? "text-primary"
                    : isActive
                      ? "text-foreground"
                      : "text-muted-foreground/50"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-8 h-px ${isDone ? "bg-primary" : "bg-border"}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
