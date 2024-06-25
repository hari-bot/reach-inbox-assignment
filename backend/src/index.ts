import express, { Request, Response } from "express";
import { getGmailAuthUrl, getGmailToken } from "./config/googleAuth";
import cors from "cors";
import "dotenv/config";
import { fetchGmailEmails, sendGmailReply } from "./services/emailService";
import { generateReply } from "./services/openaiService";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/auth/google", (req: Request, res: Response) => {
  const url = getGmailAuthUrl();
  res.redirect(url);
});

app.get("/auth/google/callback", async (req: Request, res: Response) => {
  const { code } = req.query;
  const tokens = await getGmailToken(code as string);
  res.redirect(`http://localhost:3000/home?token=${tokens?.access_token}`);
});

app.get("/api/emails/gmails", async (req: Request, res: Response) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      throw new Error("Authorization header missing or invalid");
    }
    const token = req.headers.authorization.split(" ")[1];
    const emails = await fetchGmailEmails(token);
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.post("/api/genrate/gmail", async (req: Request, res: Response) => {
  try {
    const { mail } = req.body;
    const reply = await generateReply(mail);
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate reply" });
  }
});

app.post("/api/send/gmail", async (req: Request, res: Response) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      throw new Error("Authorization header missing or invalid");
    }
    const token = req.headers.authorization.split(" ")[1];
    const { mailId, reply } = req.body;
    const { toAddress } = req.body;
    const extractEmailAddress = (headerValue: string) => {
      const match = headerValue.match(/<([^>]+)>/);
      return match ? match[1] : "";
    };

    const response = await sendGmailReply(
      token,
      mailId,
      reply,
      extractEmailAddress(toAddress)
    );
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send reply" });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`server started on http://localhost:${process.env.PORT}`);
});
