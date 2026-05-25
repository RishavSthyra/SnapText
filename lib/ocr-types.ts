export const OCR_HISTORY_LIMIT = 12;

export interface OcrHistoryItem {
  id: string;
  text: string;
  fileName: string;
  createdAt: number;
  confidence: number | null;
}
