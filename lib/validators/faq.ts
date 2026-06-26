export type FAQInput = {
  question: string;
  answer: string;
  category: string | null;
  is_active: boolean;
};

type ValidationResult =
  | {
      success: true;
      data: FAQInput;
    }
  | {
      success: false;
      error: string;
    };

function cleanText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;

  const cleaned = value.trim();

  if (!cleaned) return null;

  return cleaned.slice(0, maxLength);
}

/**
 * Validates and sanitizes FAQ / policy input before saving.
 * FAQs are used directly by the AI, so the question and answer must be clear.
 */
export function validateFAQ(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return {
      success: false,
      error: "Invalid request body.",
    };
  }

  const input = body as Record<string, unknown>;

  const question = cleanText(input.question, 300);
  const answer = cleanText(input.answer, 2000);

  if (!question) {
    return {
      success: false,
      error: "Question is required.",
    };
  }

  if (!answer) {
    return {
      success: false,
      error: "Answer is required.",
    };
  }

  return {
    success: true,
    data: {
      question,
      answer,
      category: cleanText(input.category, 100),
      is_active: typeof input.is_active === "boolean" ? input.is_active : true,
    },
  };
}