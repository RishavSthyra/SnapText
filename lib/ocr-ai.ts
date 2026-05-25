const ANTHROPIC_MESSAGES_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const DEFAULT_OCR_AI_MODEL = "claude-3-5-haiku-20241022";
const MAX_AI_INPUT_CHARS = 12000;
const AI_TIMEOUT_MS = 9000;

interface AnthropicTextBlock {
  type: "text";
  text: string;
}

interface AnthropicUsage {
  input_tokens?: number;
  output_tokens?: number;
}

interface AnthropicMessageResponse {
  content?: Array<AnthropicTextBlock | { type: string }>;
  usage?: AnthropicUsage;
}

export interface OcrAiPostprocessResult {
  text: string;
  enhanced: boolean;
  model?: string;
  usage?: AnthropicUsage;
  skippedReason?: string;
}

function getMaxTokensForText(text: string) {
  return Math.min(4096, Math.max(256, Math.ceil(text.length / 3) + 160));
}

function extractAnthropicText(response: AnthropicMessageResponse) {
  return (
    response.content
      ?.filter((block): block is AnthropicTextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim() ?? ""
  );
}

export async function postprocessOcrText(
  rawText: string
): Promise<OcrAiPostprocessResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const cleanRawText = rawText.trim();

  if (!apiKey) {
    return {
      text: cleanRawText,
      enhanced: false,
      skippedReason: "missing-api-key",
    };
  }

  if (cleanRawText.length < 3) {
    return {
      text: cleanRawText,
      enhanced: false,
      skippedReason: "too-short",
    };
  }

  if (cleanRawText.length > MAX_AI_INPUT_CHARS) {
    return {
      text: cleanRawText,
      enhanced: false,
      skippedReason: "too-long",
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  const model = process.env.ANTHROPIC_OCR_MODEL || DEFAULT_OCR_AI_MODEL;

  try {
    const response = await fetch(ANTHROPIC_MESSAGES_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "anthropic-version": ANTHROPIC_VERSION,
        "content-type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        model,
        max_tokens: getMaxTokensForText(cleanRawText),
        temperature: 0,
        system:
          "You correct OCR text after Tesseract has already extracted it. Return only the corrected text. Preserve the original language, meaning, order, names, numbers, punctuation, and line breaks where they are likely intentional. Fix only obvious OCR errors, spacing, broken words, duplicated artifacts, and quote characters. Do not add explanations, markdown, or text that is not supported by the OCR.",
        messages: [
          {
            role: "user",
            content: `Raw OCR text:\n\n${cleanRawText}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return {
        text: cleanRawText,
        enhanced: false,
        model,
        skippedReason: `ai-http-${response.status}`,
      };
    }

    const data = (await response.json()) as AnthropicMessageResponse;
    const enhancedText = extractAnthropicText(data);

    if (!enhancedText) {
      return {
        text: cleanRawText,
        enhanced: false,
        model,
        skippedReason: "empty-ai-output",
      };
    }

    return {
      text: enhancedText,
      enhanced: enhancedText !== cleanRawText,
      model,
      usage: data.usage,
    };
  } catch (error) {
    return {
      text: cleanRawText,
      enhanced: false,
      model,
      skippedReason:
        error instanceof DOMException && error.name === "AbortError"
          ? "ai-timeout"
          : "ai-error",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
