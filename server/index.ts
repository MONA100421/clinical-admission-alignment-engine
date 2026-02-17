import express, { Request, Response } from "express";
import cors from "cors";
import { runAlignmentEngine } from "./engine/alignmentEngine.js";

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

app.post("/api/optimize", (req: Request, res: Response) => {
  const { doctorNotes, pdfText, referenceNotes } = req.body;

  if (!doctorNotes || !pdfText) {
    return res.status(400).json({
      error: "Doctor notes and MCG PDF text are required.",
    });
  }

  try {
    const result = runAlignmentEngine(
      doctorNotes,
      pdfText,
      referenceNotes ?? "",
    );

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Engine failure." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
