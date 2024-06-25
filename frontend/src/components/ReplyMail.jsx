import React, { useState } from "react";

const ReplyMail = ({ isModalOpen, toggleModal, gmail }) => {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendStatus, setSendStatus] = useState("");

  const generateReply = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/genrate/gmail", {
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

  return (
    <>
      {isModalOpen && (
        <div
          id="replymail-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-xl">
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="text-lg font-semibold text-gray-900">
                  Reply to Email
                </h3>
                <button
                  type="button"
                  onClick={toggleModal}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form className="p-4 md:p-5">
                <div className="mb-4">
                  <label
                    htmlFor="to"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    To
                  </label>
                  <input
                    type="email"
                    name="to"
                    id="to"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="recipient@example.com"
                    value={extractEmailAddress(gmail.from)}
                    disabled
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Mail Body
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="12"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write your message here"
                    required
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                </div>
                <button
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  disabled={loading}
                  onClick={generateReply}
                >
                  {loading ? "Generating..." : "Generate With AI ✦"}
                </button>
                <button
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-4"
                  onClick={sendMail}
                  disabled={loading || !reply.trim()}
                >
                  {loading ? "Sending..." : "Send"}
                </button>
                {sendStatus && (
                  <p className="mt-2 text-sm text-gray-900">{sendStatus}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReplyMail;
