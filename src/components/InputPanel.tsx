import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X, AlertCircle } from "lucide-react";

interface InputPanelProps {
  onOptimize: (
    doctorNotes: string,
    pdfFile: File,
    referenceNotes?: string,
  ) => void;
  isProcessing: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({
  onOptimize,
  isProcessing,
}) => {
  const [doctorNotes, setDoctorNotes] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [referenceNotes, setReferenceNotes] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const validateAndSubmit = () => {
    const newErrors: string[] = [];
    if (!doctorNotes.trim()) newErrors.push("Doctor raw notes are required.");
    if (!pdfFile) newErrors.push("MCG Guideline PDF is required.");
    setErrors(newErrors);
    if (newErrors.length === 0 && pdfFile) {
      onOptimize(doctorNotes, pdfFile, referenceNotes || undefined);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") {
      setPdfFile(file);
      setErrors((prev) =>
        prev.filter((e) => e !== "MCG Guideline PDF is required."),
      );
    } else {
      setErrors(["Invalid file format. Please upload a PDF file."]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type === "application/pdf") {
      setPdfFile(file);
      setErrors((prev) =>
        prev.filter((e) => e !== "MCG Guideline PDF is required."),
      );
    } else if (file) {
      setErrors(["Invalid file format. Please upload a PDF file."]);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">
          Page 1 — Input Interface
        </h2>
        <p className="text-sm text-muted-foreground">
          Provide physician notes and upload the MCG Guideline PDF.
        </p>
      </div>

      {errors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex flex-col gap-1">
          {errors.map((err, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {err}
            </div>
          ))}
        </div>
      )}

      {/* Doctor Raw Notes */}
      <div className="flex-1 flex flex-col gap-2">
        <Label htmlFor="doctor-notes" className="font-semibold">
          Doctor Raw Notes *
        </Label>
        <Textarea
          id="doctor-notes"
          placeholder="Paste the physician's raw clinical notes here..."
          className="flex-1 min-h-[200px] resize-none font-mono text-sm"
          value={doctorNotes}
          onChange={(e) => setDoctorNotes(e.target.value)}
        />
      </div>

      {/* PDF Upload */}
      <div className="flex flex-col gap-2">
        <Label className="font-semibold">MCG Guideline PDF *</Label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragActive
              ? "border-primary bg-accent"
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => document.getElementById("pdf-input")?.click()}
        >
          <input
            id="pdf-input"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          {pdfFile ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div className="text-left">
                <p className="font-medium text-foreground">{pdfFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(pdfFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setPdfFile(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag & drop PDF here, or{" "}
                <span className="text-primary font-medium">browse</span>
              </p>
              <p className="text-xs text-muted-foreground">PDF files only</p>
            </div>
          )}
        </div>
      </div>

      {/* Reference Notes (optional - Case 1) */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="reference-notes" className="font-semibold">
          Reference Revised Notes{" "}
          <span className="text-muted-foreground font-normal">
            (optional — for validation)
          </span>
        </Label>
        <Textarea
          id="reference-notes"
          placeholder="Paste reference revised notes to compare AI output against..."
          className="min-h-[100px] resize-none font-mono text-sm"
          value={referenceNotes}
          onChange={(e) => setReferenceNotes(e.target.value)}
        />
      </div>

      <Button
        onClick={validateAndSubmit}
        disabled={isProcessing}
        size="lg"
        className="w-full text-base font-semibold"
      >
        {isProcessing ? "Processing..." : "Optimize Documentation"}
      </Button>
    </div>
  );
};

export default InputPanel;
