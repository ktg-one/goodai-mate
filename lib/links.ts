export const SURVEY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfLgSG9wBHdZUWtpc-JUsJGAQJ3cisJ4rJxg8MtAXH--tY8pg/viewform?usp=publish-editor";

// Business and voice-agent number supplied by Kevin.
export const PHONE_DISPLAY = "(08) 7741 4191";
export const PHONE_HREF = "tel:+61877414191";

/**
 * Validates whether a given string is a properly formatted `tel:` URI (E.164 standard).
 */
export function isValidTelUri(href: string): boolean {
  if (typeof href !== "string") return false;
  return /^tel:\+[1-9]\d{1,14}$/.test(href.trim());
}

/**
 * Validates whether a given string is a valid external HTTP or HTTPS URL.
 */
export function isValidExternalUrl(url: string): boolean {
  if (typeof url !== "string") return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}
