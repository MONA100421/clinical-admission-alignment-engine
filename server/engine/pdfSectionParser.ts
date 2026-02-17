interface PdfSections {
  [key: string]: string[];
}

export function parsePdfSections(pdfText: string): PdfSections {
  const sections: PdfSections = {};

  const lines: string[] = pdfText.split("\n").map((l: string) => l.trim());

  let currentSection = "general";

  for (const line of lines) {
    if (/admission criteria/i.test(line)) {
      currentSection = "admissionCriteria";
      sections[currentSection] = [];
      continue;
    }

    if (!sections[currentSection]) {
      sections[currentSection] = [];
    }

    sections[currentSection].push(line);
  }

  return sections;
}
