export type ProductInput = {
  name: string;
  description: string | null;
  category: string | null;
  price: number | null;
  currency: string;
  is_available: boolean;
};

type ValidationResult =
  | {
      success: true;
      data: ProductInput;
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
 * Validates and sanitizes product/service input.
 * This protects the database from invalid prices, empty names, and overly long text.
 */
export function validateProduct(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return {
      success: false,
      error: "Invalid request body.",
    };
  }

  const input = body as Record<string, unknown>;

  const name = cleanText(input.name, 120);

  if (!name) {
    return {
      success: false,
      error: "Product or service name is required.",
    };
  }

  let price: number | null = null;

  if (input.price !== null && input.price !== undefined && input.price !== "") {
    const parsedPrice = Number(input.price);

    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return {
        success: false,
        error: "Price must be a valid positive number.",
      };
    }

    price = parsedPrice;
  }

  const currency = cleanText(input.currency, 10) || "PHP";

  return {
    success: true,
    data: {
      name,
      description: cleanText(input.description, 1000),
      category: cleanText(input.category, 100),
      price,
      currency: currency.toUpperCase(),
      is_available:
        typeof input.is_available === "boolean" ? input.is_available : true,
    },
  };
}