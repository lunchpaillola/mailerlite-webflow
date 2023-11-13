"use client";
import React, { useState, useEffect } from "react";
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

const Splash = () => {
  const [token, setToken] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("webflow_auth=")
    );
    if (tokenCookie) {
      const token = tokenCookie.split("=")[1];
      setToken(token);
      localStorage.setItem("webflow_token", token);
    }
  }, []);

  const copyToClipboard = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <div className="max-w-sm w-full sm:w-1/2 lg:w-1/3 py-6 px-3">
        <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col items-center text-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-700 mb-2">Welcome!</h1>
            <p className="text-gray-700 mb-2">
              You have successfully authenticated.
            </p>
            {token ? (
              <>
              <p className="text-sm text-gray-500 mb-2">
                {isCopied ? 'Copied!' : 'Copy Your Token '}
                <button onClick={copyToClipboard}  className="text-gray-700">
                  <ClipboardDocumentIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                </button>
              </p>
              <p className='text-sm text-gray-500 break-all mb-4'>
                {token}
              </p></>
            ) : (
              <p className="text-sm text-gray-500">
                Something went wrong. No auth token was found.
              </p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-8">
              Open Webflow to begin using this app.
            </p>
            <a
              href="https://webflow.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            >
              Go to Webflow
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Splash;
