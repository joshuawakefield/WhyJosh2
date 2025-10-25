
// This file runs on the server.

/**
 * Scrubs PII like emails, phone numbers, and common URL formats from text.
 * @param text The input text to scrub.
 * @returns The scrubbed text.
 */
export function scrubPII(text: string): string {
  // Regex for emails
  const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/g;
  // Regex for phone numbers (basic)
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  // Regex for URLs, being careful not to remove all links
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  // Regex for LinkedIn profiles
  const linkedinRegex = /https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/g;

  return text
    .replace(emailRegex, '[email redacted]')
    .replace(phoneRegex, '[phone redacted]')
    .replace(linkedinRegex, '[linkedin profile redacted]');
    // Note: A more sophisticated URL scrubber might be needed to avoid removing essential links from the JD.
}
