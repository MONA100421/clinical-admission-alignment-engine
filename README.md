# Clinical Documentation Optimization System

A deterministic web-based Clinical Documentation Optimization System that aligns physician documentation with structured MCG Admission Guideline criteria.

This system was developed as a validation prototype to demonstrate structured admission criteria alignment without the use of generative AI.

**Author: Chenyi Weng**  
Full-stack Developer | TypeScript | Clinical Rule Engine Architecture

## Project Overview

This project implements a **two-page clinical workflow system** that:

* Accepts raw physician notes
* Accepts an uploaded MCG Guideline PDF
* Extracts structured admission criteria
* Performs deterministic criteria matching
* Generates optimized documentation
* Identifies missing admission criteria
* Computes structured admission alignment score
* Supports validation comparison against reference documentation

## Core Architecture

## 🚀 Getting Started

### Backend

```bash
cd server
npm install
npm run dev

Server runs at:
http://localhost:5050
```

### Frontend

```bash
cd src
npm install
npm run dev

Frontend runs at:
http://localhost:8081
```

### Frontend

* **React**
* **TypeScript**
* TailwindCSS
* pdfjs-dist (PDF text extraction)
* Modular component architecture

### Backend

* **Node.js**
* **Express**
* **TypeScript**
* Deterministic Rule Engine (No LLM / No AI API)

## Two-Page Workflow

### Page 1 – Input Interface

Required Inputs:

* Doctor Raw Notes (Text Input)
* MCG Guideline PDF (Upload, PDF Only)

Optional:

* Reference Revised Notes (Case 1 validation mode)

Features:

* Drag-and-drop PDF support
* File validation (PDF only)
* Error handling (empty notes / missing PDF)
* Step indicator:

  * Parsing Guidelines
  * Extracting Clinical Data
  * Matching Criteria
  * Generating Output

### Page 2 – Output Interface

Produces exactly two structured outputs:

#### 1. Revised Doctor Notes

Structured into:

* Clinical Summary
* Medical Necessity Justification
* Risk Stratification
* Conclusion

Includes:

* Explicit hypoxemia documentation
* Oxygen requirement
* Imaging findings
* Laboratory abnormalities
* Outpatient therapy failure
* Comorbid risk factors
* Admission recommendation

#### 2. Missing Criteria List

Structured Table:

| Criteria | Status | Evidence Found | Suggested Language |

Each extracted criterion is classified as:

* Met
* Partially Met
* Missing

<p align="center">
  <img src="screenshots/main_workflow.png" width="800" />
  <img src="screenshots/Missing_Criteria_Evaluation.png" width="800" />
  <img src="screenshots/Validation_Mode.png" width="800" />
</p>

## Deterministic Rule Engine

The system uses a structured rule engine consisting of:

* Clinical signal extraction:

  * Hypoxemia
  * Oxygen requirement
  * Imaging findings
  * Laboratory abnormalities
  * Outpatient therapy failure
  * Comorbidities

* Guideline criteria classification:

  * Respiratory
  * Imaging
  * Laboratory
  * Outpatient
  * Comorbidity

* Weighted scoring model

* Admission threshold decision engine

Admission decision threshold:

```
percentage >= 60% → Admit
percentage < 60% → Do Not Admit
```

## Validation Mode (Case 1)

If reference notes are provided:

* Structured section parsing
* Section-by-section similarity scoring
* Overall structured similarity percentage
* Word-level difference highlighting

Sections evaluated independently:

* Clinical Summary
* Medical Necessity Justification
* Risk Stratification
* Conclusion

## Example Scenarios

### Case 1 – Validation Mode

Inputs:

* Doctor Raw Notes
* MCG Guideline PDF
* Reference Revised Notes

Outputs:

* Revised Doctor Notes
* Missing Criteria Table
* Structured Similarity Score

### Case 2 – Optimization Mode

Inputs:

* Doctor Raw Notes
* MCG Guideline PDF

Outputs:

* Revised Doctor Notes
* Missing Criteria Table
* Admission Recommendation

## Security & Data Handling

* No persistent storage
* All processing session-based
* No external AI APIs used
* Fully deterministic logic

## Design Philosophy

This system intentionally avoids large language models.

It demonstrates:

* Structured clinical criteria extraction
* Deterministic guideline alignment
* Explainable scoring logic
* Transparent admission recommendation

The architecture prioritizes:

* Auditability
* Reproducibility
* Clinical defensibility

## Disclaimer

This tool assists clinical documentation and does not replace physician judgment.