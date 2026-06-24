export type TextChunk = {
  content: string;
  chunkIndex: number;
  tokenEstimate: number;
};

const CHUNK_SIZE = 1200;
const CHUNK_OVERLAP = 150;
const MAX_CHUNKS = 60;

/**
 * Splits document text into smaller chunks.
 * Allows short documents for MVP testing.
 */
export function chunkText(text: string): TextChunk[] {
  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

  if (!normalized) return [];

  if (normalized.length <= CHUNK_SIZE) {
    return [
      {
        content: normalized,
        chunkIndex: 0,
        tokenEstimate: Math.max(1, Math.ceil(normalized.length / 4)),
      },
    ];
  }

  const chunks: TextChunk[] = [];
  let start = 0;
  let chunkIndex = 0;

  while (start < normalized.length && chunks.length < MAX_CHUNKS) {
    const end = Math.min(start + CHUNK_SIZE, normalized.length);
    const content = normalized.slice(start, end).trim();

    if (content.length > 0) {
      chunks.push({
        content,
        chunkIndex,
        tokenEstimate: Math.max(1, Math.ceil(content.length / 4)),
      });

      chunkIndex += 1;
    }

    if (end >= normalized.length) break;

    start = Math.max(0, end - CHUNK_OVERLAP);
  }

  return chunks;
}