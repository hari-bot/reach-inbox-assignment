import express, { Request, Response } from "express";
import { getGmailAuthUrl, getGmailToken } from "./config/googleAuth";
import cors from "cors";
import "dotenv/config";
import { fetchGmailEmails } from "./services/emailService";

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

app.listen(process.env.PORT || 5000, () => {
  console.log(`server started on http://localhost:${process.env.PORT}`);
});
