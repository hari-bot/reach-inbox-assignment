import React, { useState, useEffect } from "react";
import { fetchGmailEmails } from "../api";
import ReplyMail from "./ReplyMail";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const Emails = () => {
  const [emails, setEmails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [currentMail, setCurrentMail] = useState({});
  const [expandedEmails, setExpandedEmails] = useState({});

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
        return "text-green-500 border-green-500";
      case "More Information":
        return "text-yellow-500 border-yellow-500";
      case "Not Interested":
        return "text-red-500 border-red-500";
      default:
        return "";
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleEmailExpansion = (id) => {
    setExpandedEmails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (error) {
    return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
  }

  return (
    <div className="p-6 mx-auto max-w-5xl bg-gradient-to-b from-white to-indigo-50 font-sans mt-8 rounded-lg shadow-2xl">
      <ReplyMail
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        gmail={currentMail}
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
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-indigo-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-900 mb-2">
                      {email.subject}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      From: {email.from}
                    </p>
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusClass(
                        email.category
                      )}`}
                    >
                      {email.category}
                    </span>
                  </div>
                  <button
                    className="text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
                    onClick={() => {
                      toggleModal();
                      setCurrentMail(email);
                    }}
                  >
                    Reply with AI
                  </button>
                </div>
                <div className="mt-4">
                  <div
                    className={`text-md text-gray-700 ${
                      expandedEmails[email.id] ? "" : "line-clamp-3"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: email.body,
                    }}
                  />
                  <button
                    className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition duration-300 ease-in-out"
                    onClick={() => toggleEmailExpansion(email.id)}
                  >
                    {expandedEmails[email.id] ? (
                      <>
                        Show Less <FiChevronUp className="w-5 h-5 ml-1" />
                      </>
                    ) : (
                      <>
                        Show More <FiChevronDown className="w-5 h-5 ml-1" />
                      </>
                    )}
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
