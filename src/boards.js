export const EXAM_BOARDS = [
  { id: "aqa", name: "AQA", region: "UK", level: "GCSE / A-Level" },
  { id: "edexcel", name: "Pearson Edexcel", region: "UK", level: "GCSE / A-Level" },
  { id: "ocr", name: "OCR", region: "UK", level: "GCSE / A-Level" },
  { id: "wjec", name: "WJEC", region: "UK (Wales)", level: "GCSE / A-Level" },
  { id: "cchea", name: "CCEA", region: "UK (NI)", level: "GCSE / A-Level" },
  { id: "sqa", name: "SQA", region: "UK (Scotland)", level: "National / Higher" },
  { id: "cie", name: "Cambridge International (CIE)", region: "International", level: "IGCSE / A-Level" },
  { id: "ocx", name: "OxfordAQA", region: "International", level: "IGCSE / A-Level" },
  { id: "ib", name: "International Baccalaureate (IB)", region: "International", level: "DP" },
  { id: "ap", name: "College Board AP", region: "US", level: "Advanced Placement" },
  { id: "sat", name: "College Board SAT", region: "US", level: "College Entrance" },
  { id: "act", name: "ACT", region: "US", level: "College Entrance" },
  { id: "regents", name: "NY Regents", region: "US (NY)", level: "Regents" },
  { id: "cbse", name: "CBSE", region: "India", level: "Class 10 / 12" },
  { id: "icse", name: "CISCE ICSE", region: "India", level: "Class 10 / 12" },
  { id: "ncea", name: "NCEA", region: "New Zealand", level: "Levels 1-3" },
  { id: "hsc", name: "HSC (NSW)", region: "Australia", level: "Year 12" },
  { id: "vce", name: "VCE (Victoria)", region: "Australia", level: "Year 12" },
  { id: "bacc", name: "French Baccalaureate", region: "France", level: "Baccalaureate" },
  { id: "lc", name: "Leaving Certificate", region: "Ireland", level: "Leaving Cert" },
  { id: "sa", name: "South Africa NSC (CAPS / DBE)", region: "ZA", level: "Matric (Grade 12)" },
  { id: "tz", name: "Tanzania NECTA", region: "TZ", level: "CSEE / ACSEE" },
];

export function listBoards() {
  return EXAM_BOARDS;
}

export function getBoard(id) {
  return EXAM_BOARDS.find((b) => b.id === id);
}

export function boardRegion(boardId) {
  return "global";
}
