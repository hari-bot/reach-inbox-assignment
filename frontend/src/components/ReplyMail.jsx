import React, { useState, useRef, useEffect } from "react";

const ReplyMail = ({ isModalOpen, toggleModal, gmail }) => {
  const [reply, setReply] = useState("");
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [sendStatus, setSendStatus] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        toggleModal();
        setReply("");
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen, toggleModal]);

  const generateReply = async (e) => {
    e.preventDefault();
    setLoadingGenerate(true);

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
      setLoadingGenerate(false);
    }
  };

  const sendMail = async () => {
    setLoadingSend(true);

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
      setLoadingSend(false);
    }
  };

  const extractEmailAddress = (headerValue) => {
    const match = headerValue.match(/<([^>]+)>/);
    return match ? match[1] : "";
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-50">
      <div ref={modalRef} className="relative p-4 w-full max-w-2xl">
        <div className="relative bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">
              Reply to Email
            </h3>
            <button
              type="button"
              onClick={() => {
                toggleModal();
                setReply("");
              }}
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
          <form className="p-6">
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
            <div className="flex justify-between items-center">
              <button
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-300 ease-in-out"
                disabled={loadingGenerate}
                onClick={generateReply}
              >
                {loadingGenerate ? "Generating..." : "Generate With AI ✦"}
              </button>
              <button
                className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-300 ease-in-out"
                onClick={() => {
                  sendMail();
                  setReply("");
                }}
                disabled={loadingSend || !reply.trim()}
              >
                {loadingSend ? "Sending..." : "Send"}
              </button>
            </div>
            {sendStatus && (
              <p className="mt-4 text-sm text-center font-medium text-green-600">
                {sendStatus}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReplyMail;
