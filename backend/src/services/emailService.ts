import { gmail_v1, google } from "googleapis";

export const fetchGmailEmails = async (authToken: string) => {
  const authClient = new google.auth.OAuth2();
  authClient.setCredentials({ access_token: authToken });

  const gmail = google.gmail({ version: "v1", auth: authClient });

  try {
    const res = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread",
      maxResults: 15,
    });

    const messages = res.data.messages || [];
    const emails: gmail_v1.Schema$Message[] = await Promise.all(
      messages.map(async (message) => {
        const messageRes = await gmail.users.messages.get({
          userId: "me",
          id: message.id!,
          format: "full",
        });

        const headers = messageRes.data.payload?.headers || [];
        const fromHeader = headers.find((header) => header.name === "From");
        const from = fromHeader ? fromHeader.value : "Unknown";

        const subjectHeader = headers.find(
          (header) => header.name === "Subject"
        );
        const subject = subjectHeader ? subjectHeader.value : "No Subject";

        const body = messageRes.data.snippet || "No snippet available";

        return {
          id: message.id!,
          threadId: message.threadId!,
          from,
          subject,
          body,
        };
      })
    );

    return emails;
  } catch (error) {
    console.error("Error fetching Gmail emails:", error);
    throw new Error("Failed to fetch Gmail emails");
  }
};

export const sendGmailReply = async (
  authToken: string,
  messageId: string,
  reply: string
) => {
  const authClient = new google.auth.OAuth2();
  authClient.setCredentials({ access_token: authToken });

  const gmail = google.gmail({ version: "v1", auth: authClient });

  try {
    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: Buffer.from(reply).toString("base64"),
      },
    });
  } catch (error) {
    console.error("Error sending Gmail reply:", error);
    throw new Error("Failed to send Gmail reply");
  }
};
