import React, { useState } from "react";

const ReplyMail = ({ isModalOpen, toggleModal, gmail }) => {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendStatus, setSendStatus] = useState("");

  const generateReply = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/generate/gmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mail: gmail.body }),
      });

      const data = await response.json();
      setReply(data.reply);
    } catch (error) {
      console.error("Error generating reply:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMail = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/send/gmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("googleToken")}`,
        },
        body: JSON.stringify({
          mailId: gmail.id,
          reply,
          toAddress: gmail.from,
        }),
      });

      if (response.status === 200) setSendStatus("Email sent successfully!");
      console.log("Response from sending email:", response);
    } catch (error) {
      console.error("Error sending email:", error);
      setSendStatus("Failed to send email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const extractEmailAddress = (headerValue) => {
    const match = headerValue.match(/<([^>]+)>/);
    return match ? match[1] : "";
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-2xl font-semibold text-gray-900">
            Reply to Email
          </h3>
          <button
            onClick={() => {
              toggleModal();
              setReply("");
            }}
            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <form className="p-6">
          <div className="mb-4">
            <label
              htmlFor="to"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              To
            </label>
            <input
              type="email"
              name="to"
              id="to"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={extractEmailAddress(gmail.from)}
              disabled
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mail Body
            </label>
            <textarea
              id="message"
              name="message"
              rows="8"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Write your message here"
              required
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
              onClick={generateReply}
            >
              {loading ? "Generating..." : "Generate With AI ✦"}
            </button>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => {
                sendMail();
                setReply("");
              }}
              disabled={loading || !reply.trim()}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
          {sendStatus && (
            <p className="mt-4 text-sm text-center font-medium text-gray-900">
              {sendStatus}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ReplyMail;
