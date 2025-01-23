import React, { useState, useEffect } from "react";
import { fetchGmailEmails } from "../api";
import ReplyMail from "./ReplyMail";
import EmailModal from "./EmailModal";

const Emails = () => {
  const [emails, setEmails] = useState([]);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [currentMail, setCurrentMail] = useState({});

  useEffect(() => {
    const googleToken = localStorage.getItem("googleToken");

    const fetchEmails = async () => {
      try {
        const gmailEmails = googleToken
          ? await fetchGmailEmails(googleToken)
          : [];
        setEmails(
          gmailEmails.map((email) => ({
            ...email,
            isHtml: email.body.trim().startsWith("<"),
          }))
        );
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEmails();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Interested":
        return "text-green-500 border-green-500";
      case "More Information":
        return "text-yellow-500 border-yellow-500";
      case "Not Interested":
        return "text-red-500 border-red-500";
      default:
        return "";
    }
  };

  const toggleReplyModal = () => {
    setIsReplyModalOpen(!isReplyModalOpen);
  };

  const toggleEmailModal = (email) => {
    setCurrentMail(email);
    setIsEmailModalOpen(!isEmailModalOpen);
  };

  if (error) {
    return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
  }

  return (
    <div className="p-6 mx-auto max-w-5xl bg-gradient-to-b from-white to-indigo-50 font-sans mt-8 rounded-lg shadow-2xl">
      <ReplyMail
        isModalOpen={isReplyModalOpen}
        toggleModal={toggleReplyModal}
        gmail={currentMail}
      />
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        email={currentMail}
        isHtml={currentMail.isHtml}
      />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-800">Email Inbox</h2>
      </div>
      <div className="space-y-6">
        {emails.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No emails to display.
          </p>
        ) : (
          <ul className="space-y-6">
            {emails.map((email) => (
              <li
                key={email.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-indigo-100 cursor-pointer"
                onClick={() => toggleEmailModal(email)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-900 mb-2">
                      {email.subject}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      From: {email.from}
                    </p>
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full border ${getStatusClass(
                        email.category
                      )}`}
                    >
                      {email.category}
                    </span>
                  </div>
                  <button
                    className="text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleReplyModal();
                      setCurrentMail(email);
                    }}
                  >
                    Reply with AI
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Emails;
