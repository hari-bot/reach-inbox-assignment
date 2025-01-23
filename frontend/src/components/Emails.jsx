import React, { useState, useEffect } from "react";
import { fetchGmailEmails } from "../api";
import ReplyMail from "./ReplyMail";

const Emails = () => {
  const [emails, setEmails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [currentMail, setCurrentMail] = useState({});

  useEffect(() => {
    const googleToken = localStorage.getItem("googleToken");

    const fetchEmails = async () => {
      try {
        const gmailEmails = googleToken
          ? await fetchGmailEmails(googleToken)
          : [];
        setEmails(gmailEmails);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEmails();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Interested":
        return "bg-green-100 text-green-800 border-green-300";
      case "More Information":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Not Interested":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ReplyMail
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        gmail={currentMail}
      />
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Email Inbox</h2>
        {emails.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No emails to display.
          </p>
        ) : (
          <ul className="space-y-6">
            {emails.map((email) => (
              <li
                key={email.id}
                className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {email.subject}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      From: {email.from}
                    </p>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusClass(
                        email.category
                      )}`}
                    >
                      {email.category}
                    </span>
                  </div>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                    onClick={() => {
                      toggleModal();
                      setCurrentMail(email);
                    }}
                  >
                    Reply with AI
                  </button>
                </div>
                <div
                  className="text-gray-700 mb-4 prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: email.body,
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Emails;
