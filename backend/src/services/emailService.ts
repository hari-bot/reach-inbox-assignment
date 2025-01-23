import { google } from "googleapis";
import { Base64 } from "js-base64";
import { analyzeEmailContent } from "./openaiService";

const createAuthClient = (authToken: string) => {
  const authClient = new google.auth.OAuth2();
  authClient.setCredentials({ access_token: authToken });
  return google.gmail({ version: "v1", auth: authClient });
};

export const fetchGmailEmails = async (authToken: string) => {
  const gmail = createAuthClient(authToken);

  try {
    const res = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread",
      maxResults: 5,
    });

    const messages = res.data.messages || [];
    const emails = await Promise.all(
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

        const body = extractEmailBody(messageRes.data.payload);

        // Replace this with your category analysis logic if needed
        const category = "Interested";

        return {
          id: message.id!,
          threadId: message.threadId!,
          from,
          subject,
          body,
          category,
        };
      })
    );

    return emails;
  } catch (error) {
    console.error("Error fetching Gmail emails:", error);
    throw new Error("Failed to fetch Gmail emails");
  }
};

const extractEmailBody = (payload: any): string => {
  if (!payload) return "No content available";

  const mimeType = payload.mimeType;

  // For single-part messages
  if (mimeType === "text/plain" || mimeType === "text/html") {
    return decodeBase64Url(payload.body?.data || "");
  }

  // For multipart messages
  if (payload.parts && payload.parts.length > 0) {
    const part = payload.parts.find(
      (p: any) => p.mimeType === "text/plain" || p.mimeType === "text/html"
    );
    return part
      ? decodeBase64Url(part.body?.data || "")
      : "No content available";
  }

  return "No content available";
};

const decodeBase64Url = (encoded: string): string => {
  if (!encoded) return "";
  const decoded = Buffer.from(encoded, "base64").toString("utf-8");
  return decoded;
};

export const sendGmailReply = async (
  authToken: string,
  messageId: string,
  replyRaw: string,
  toAddress: string
) => {
  const gmail = createAuthClient(authToken);

  try {
    const messageResponse = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
    });

    const replyBody = `To: ${toAddress}\r\n\r\n${replyRaw}`;
    const encodedReply = Base64.encodeURI(replyBody);

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedReply,
      },
    });

    console.log("Reply sent successfully.");
  } catch (error) {
    console.error("Error sending Gmail reply:", error);
    throw new Error("Failed to send Gmail reply");
  }
};
