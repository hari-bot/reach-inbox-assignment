import { google } from "googleapis";
import "dotenv/config";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

export const getGmailAuthUrl = () => {
  const scopes = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
  ];
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
};

export const getGmailToken = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

export const setGmailCredentials = (tokens: any) => {
  oauth2Client.setCredentials(tokens);
};

export const gmailClient = oauth2Client;
