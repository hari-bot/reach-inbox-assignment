const API_URL = "http://localhost:5000/api";

export const fetchGmailEmails = async (token) => {
  const response = await fetch(`${API_URL}/emails/gmails`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch Gmail emails");
  }
  return response.json();
};
