import React, { useState, useEffect } from "react";
import { fetchGmailEmails, fetchOutlookEmails } from "./emailApi";

const Emails = () => {
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const googleToken = localStorage.getItem("googleToken");

    const fetchEmails = async () => {
      try {
        const [gmailEmails, outlookEmails] = await Promise.all([
          googleToken ? fetchGmailEmails(googleToken) : [],
          outlookToken ? fetchOutlookEmails(outlookToken) : [],
        ]);
        setEmails([...gmailEmails, ...outlookEmails]);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEmails();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Emails</h1>
      {emails.length === 0 ? (
        <p>No emails to display.</p>
      ) : (
        <ul>
          {emails.map((email) => (
            <li key={email.id}>
              <strong>From:</strong> {email.from}
              <br />
              <strong>Subject:</strong> {email.subject}
              <br />
              <strong>Body:</strong> {email.body}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Emails;
