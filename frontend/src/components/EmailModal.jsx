import React, { useRef, useEffect } from "react";
import { FiX } from "react-icons/fi";

const EmailModal = ({ isOpen, onClose, email, isHtml }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-indigo-900">
            {email.subject}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-2">From: {email.from}</p>
        <div className="mt-4">
          {email.isHtml ? (
            <div
              className="text-md text-gray-700"
              dangerouslySetInnerHTML={{ __html: email.body }}
            />
          ) : (
            <pre className="text-md text-gray-700 whitespace-pre-wrap font-sans">
              {email.body}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
