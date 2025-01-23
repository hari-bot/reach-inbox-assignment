import express from "express";
import cors from "cors";
import {
  getEmails,
  generateGmailReply,
  sendGmailReplyHandler,
} from "./controllers/gmailController";
import { getGmailAuthUrl, getGmailToken } from "./config/googleAuth";
import "./queues/emailQueue";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/auth/google", (req, res) => {
  const url = getGmailAuthUrl();
  res.redirect(url);
});

app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens, userInfo } = await getGmailToken(code as string);
    const userInfoString = encodeURIComponent(JSON.stringify(userInfo));

    res.redirect(
      `http://localhost:3000/home?token=${tokens.access_token}&userInfo=${userInfoString}`
    );
  } catch (error) {
    console.error("Error during Google callback:", error);
    res.status(500).send("Authentication failed");
  }
});

app.get("/api/emails/gmails", getEmails);
app.post("/api/generate/gmail", generateGmailReply);
app.post("/api/send/gmail", sendGmailReplyHandler);

export default app;
