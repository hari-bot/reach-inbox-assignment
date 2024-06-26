import { Queue, Worker, QueueEvents } from "bullmq";
import { sendGmailReply } from "../services/emailService";
import IORedis from "ioredis";
import "dotenv/config";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const connectionOptions = {
  maxRetriesPerRequest: null,
  url: redisUrl,
};

const connection = new IORedis(connectionOptions);

interface EmailJobData {
  authToken: string;
  messageId: string;
  replyRaw: string;
  toAddress: string;
}

export const emailQueue = new Queue<EmailJobData>("emailQueue", { connection });

new Worker<EmailJobData>(
  "emailQueue",
  async (job) => {
    const { authToken, messageId, replyRaw, toAddress } = job.data;
    await sendGmailReply(authToken, messageId, replyRaw, toAddress);
  },
  { connection }
);

const emailQueueEvents = new QueueEvents("emailQueue", { connection });

emailQueueEvents.on("completed", ({ jobId }) => {
  console.log(`Job with id ${jobId} has been completed`);
});

emailQueueEvents.on("failed", ({ jobId, failedReason }) => {
  console.log(`Job with id ${jobId} has failed with error ${failedReason}`);
});
