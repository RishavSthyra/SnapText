export const SHARE_EXPIRY_SECONDS = 300;
export const DEFAULT_CODE_LANGUAGE = "plaintext";
export const MAX_CODE_GENERATION_ATTEMPTS = 10;

export const CODE_LANGUAGE_OPTIONS = [
  { value: "plaintext", label: "Plain text" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "bash", label: "Bash" },
  { value: "json", label: "JSON" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "sql", label: "SQL" },
] as const;

export type CodeLanguage = (typeof CODE_LANGUAGE_OPTIONS)[number]["value"];
export type ShareContentType = "text" | "code";

export interface StoredSharePayload {
  text: string;
  contentType: ShareContentType;
  language: CodeLanguage;
  createdAt: number;
  expiresAt: number;
  burnAfterReading: true;
}

export function isCodeLanguage(value: string): value is CodeLanguage {
  return CODE_LANGUAGE_OPTIONS.some((option) => option.value === value);
}
