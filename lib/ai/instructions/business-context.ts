interface BusinessContextParams {
  business: any;
  productText: string;
  faqText: string;
  knowledgeText: string;
  historyText: string;
  customerMessage: string;
}

export const getBusinessContext = ({
  business,
  productText,
  faqText,
  knowledgeText,
  historyText,
  customerMessage,
}: BusinessContextParams) => `
Business Information:
Name: ${business?.name || "Not specified"}
Description: ${business?.description || "Not specified"}
Address: ${business?.address || "Not specified"}
Contact Number: ${business?.contact_number || "Not specified"}
Email: ${business?.email || "Not specified"}
Opening Hours: ${business?.opening_hours || "Not specified"}
Closing Hours: ${business?.closing_hours || "Not specified"}
Delivery Info: ${business?.delivery_info || "Not specified"}
Payment Methods: ${business?.payment_methods || "Not specified"}

Products / Services:
${productText}

FAQs:
${faqText}

Uploaded Document Matches:
${knowledgeText}

Conversation History:
${historyText}

Latest Customer Message:
${customerMessage}

Reply to the latest customer message using the conversation history and business data.
`;