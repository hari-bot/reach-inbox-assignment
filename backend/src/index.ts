import express, { Request, Response } from "express";
import { getGmailAuthUrl, getGmailToken } from "./auth/googleAuth";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/test", async (req: Request, res: Response) => {
  res.json({ message: "Hello !" });
});

app.get("/auth/google", (req, res) => {
  const url = getGmailAuthUrl();
  res.redirect(url);
});

app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  const tokens = await getGmailToken(code as string);
  res.send(`Google account connected! ${tokens}`);
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`server started on http://localhost:${process.env.PORT}`);
});
