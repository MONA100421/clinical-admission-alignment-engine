# Clinical Admission Alignment Engine

Web-based clinical documentation optimization system that aligns physician notes with structured admission guideline criteria.

## Project Overview

This system implements a two-page workflow:

Page 1 – Input Interface  
- Doctor Raw Notes (text input)  
- MCG Guideline PDF (document upload)  

Page 2 – Output Interface  
- Revised Doctor Notes  
- Missing Criteria List  

The system supports structured development and validation testing.

## Test Cases

### Case 1
Inputs:
- Doctor Raw Notes
- MCG Guideline PDF
- Sample Revised Doctor Notes (reference output)

System performs:
- Structured criteria extraction
- Clinical alignment
- Revised documentation generation
- Missing criteria identification
- Reference comparison

### Case 2
Inputs:
- Doctor Raw Notes

System generates:
- Revised Doctor Notes
- Missing Criteria List

## Architecture

Frontend:
- React + TypeScript (Vite)
- Two-panel workflow UI
- Validation comparison component

Backend:
- Node.js + Express
- Deterministic rule-based clinical alignment engine
- Structured JSON output
