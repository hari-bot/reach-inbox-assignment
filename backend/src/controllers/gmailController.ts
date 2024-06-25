import { Request, Response } from "express";
import { fetchGmailEmails, sendGmailReply } from "../services/emailService";
import { generateReply } from "../services/openaiService";
import { extractEmailAddress } from "../utils/helpers";

export const getEmails = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Authorization header missing or invalid");
    }
    const token = authHeader.split(" ")[1];
    const emails = await fetchGmailEmails(token);
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const generateGmailReply = async (req: Request, res: Response) => {
  try {
    const { mail } = req.body;
    const reply = await generateReply(mail);
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate reply" });
  }
};

export const sendGmailReplyHandler = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Authorization header missing or invalid");
    }
    const token = authHeader.split(" ")[1];
    const { mailId, reply, toAddress } = req.body;
    const email = extractEmailAddress(toAddress);

    const response = await sendGmailReply(token, mailId, reply, email);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send reply" });
  }
};
