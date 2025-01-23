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
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: authToken });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  try {
    // Fetch the original message details to get headers for reply
    const messageResponse = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "metadata",
      metadataHeaders: ["In-Reply-To", "References", "Message-ID"],
    });

    const headers = messageResponse.data.payload?.headers || [];
    const inReplyTo = headers.find(
      (header) => header.name === "Message-ID"
    )?.value;
    const references = headers.find(
      (header) => header.name === "References"
    )?.value;

    // Construct the reply email
    const replyBody = [
      `To: ${toAddress}`,
      `In-Reply-To: ${inReplyTo || ""}`,
      `References: ${references || ""}`,
      "Subject: Re: Your Email",
      "",
      replyRaw,
    ].join("\r\n");

    // Encode the reply in Base64URL
    const encodedReply = Buffer.from(replyBody)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // Send the reply
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
