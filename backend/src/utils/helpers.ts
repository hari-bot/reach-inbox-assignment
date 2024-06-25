export const extractEmailAddress = (headerValue: string) => {
  const match = headerValue.match(/<([^>]+)>/);
  return match ? match[1] : "";
};
