import React, { useState, useEffect } from "react";
import { fetchGmailEmails } from "../api";

const Emails = () => {
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState(null);

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

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 mx-auto max-w-3xl bg-white font-sans mt-20 border rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Emails History</h2>
      </div>
      <div className="space-y-4">
        {emails.length === 0 ? (
          <p className="text-center text-gray-500">No emails to display.</p>
        ) : (
          <ul className="space-y-4">
            {emails.map((email) => (
              <li
                key={email.id}
                className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {email.subject}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500">From: {email.from}</p>
                    <small
                      className={`font-light px-2 rounded-lg border ${getStatusClass(
                        email.category
                      )}`}
                    >
                      {email.category}
                    </small>
                  </div>
                </div>
                <p className="text-md text-gray-700 mb-2">{email.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Emails;
