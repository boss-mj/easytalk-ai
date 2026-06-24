export type BusinessProfileInput = {
    name: string;
    description: string | null;
    contact_number: string | null;
    email: string | null;
    address: string | null;
    opening_hours: string | null;
    closing_hours: string | null;
    delivery_info: string | null;
    payment_methods: string | null;
};

type ValidationResult =
    | {
        success: true;
        data: BusinessProfileInput;
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

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates and sanitizes business profile input before saving to Supabase.
 * This prevents empty business names and limits very long text inputs.
 */
export function validateBusinessProfile(body: unknown): ValidationResult {
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
            error: "Business name is required.",
        };
    }

    const email = cleanText(input.email, 160);

    if (email && !isValidEmail(email)) {
        return {
            success: false,
            error: "Please enter a valid email address.",
        };
    }

    return {
        success: true,
        data: {
            name,
            description: cleanText(input.description, 1000),
            contact_number: cleanText(input.contact_number, 80),
            email,
            address: cleanText(input.address, 300),
            opening_hours: cleanText(input.opening_hours, 300),
            closing_hours: cleanText(input.closing_hours, 300),
            delivery_info: cleanText(input.delivery_info, 700),
            payment_methods: cleanText(input.payment_methods, 500),
        },
    };
}