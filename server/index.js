import express from "express";
import cors from "cors";

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

/*
  Deterministic Clinical Alignment Engine
  Fully matches required project schema
*/

app.post("/api/optimize", (req, res) => {
  const { doctorNotes, pdfText, referenceNotes } = req.body;

  if (!doctorNotes) {
    return res.status(400).json({ error: "Doctor notes are required." });
  }

  // ====== Extract criteria from PDF ======
  let extractedCriteria = [];

  if (pdfText) {
    const lines = pdfText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 20);

    extractedCriteria = lines.slice(0, 10).map((line, index) => ({
      id: `C${index + 1}`,
      criterion: line,
      category: "Admission Criteria",
    }));
  }

  // ====== Extract clinical findings ======
  const lower = doctorNotes.toLowerCase();

  const hasPneumonia = lower.includes("pneumonia");
  const hasHypoxia = /o2\s*<\s*90|oxygen\s*saturation\s*<\s*90/.test(lower);
  const hasImaging = lower.includes("x-ray") || lower.includes("ct");
  const hasWBC = lower.includes("wbc");
  const hasOutpatientFailure =
    lower.includes("failed outpatient") ||
    lower.includes("no improvement") ||
    lower.includes("worsening");

  // ====== Evaluate criteria ======
  const missingCriteria = extractedCriteria.map((criterion) => {
    let status = "Missing";
    let evidence = "";
    let suggestion = "";

    if (hasPneumonia || hasImaging) {
      status = "Met";
      evidence = "Clinical documentation references pneumonia or imaging.";
    } else if (lower.length > 50) {
      status = "Partially Met";
      evidence = "Some symptoms present but not explicitly aligned.";
      suggestion =
        "Explicitly document radiographic confirmation of pneumonia and severity indicators.";
    } else {
      suggestion =
        "Document clinical findings clearly aligning with admission guideline language.";
    }

    return {
      criterion: criterion.criterion,
      status,
      evidenceFound: evidence,
      suggestedLanguage: suggestion,
    };
  });

  // ====== Generate revised notes ======
  const revisedNotes = {
    clinicalSummary: `Patient presents with documented symptoms consistent with acute respiratory illness. ${
      hasHypoxia ? "Hypoxemia is documented." : ""
    }`,

    medicalNecessityJustification: `Admission is medically necessary due to clinical severity, ${
      hasOutpatientFailure ? "failure of outpatient therapy," : ""
    } and risk of clinical deterioration.`,

    riskStratification: `Patient risk factors and comorbidities increase likelihood of adverse outcome.`,

    conclusion:
      "Based on documented findings and admission guideline alignment, inpatient admission is justified.",
  };

  // ====== Return strict schema ======
  return res.json({
    extractedCriteria,
    revisedNotes,
    missingCriteria,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
