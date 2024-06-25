const API_URL = "http://localhost:5000";

export const fetchGmailEmails = async (token) => {
  const response = await fetch(`${API_URL}/emails/gmail`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch Gmail emails");
  }
  return response.json();
};
