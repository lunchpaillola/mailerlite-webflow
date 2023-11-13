"use client";
import React from "react";
import { LoginProps } from "../types/globalTypes";
// Add your auth URL here
const AUTH_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const Login: React.FC<LoginProps> = ({
  setPage,
  token,
  setToken,
}: {
  setPage: any;
  token: any;
  setToken: any;
}) => {
  return token ? (
    <div className="flex items-center min-h-screen py-2 bg-wf-gray text-wf-lightgray">
      <div className="w-full">
        <div className="w-full px-4 fixed top-16">
          <h1 className="text-center font-medium text-gray-200">
            Account authorized
          </h1>
          <p className="text-md text-center text-gray-400">
            Continue to connect forms
          </p>
          <div className="mt-4 px-4 space-y-6">
            <button
              onClick={() => setPage(1)}
              style={{
                backgroundColor: "#383838",
                color: "white",
                padding: "8px 16px",
                borderRadius: "4px",
                display: "block",
                textAlign: "center",
                width: "100%",
                boxSizing: "border-box",
                textDecoration: "none",
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center min-h-screen py-2 bg-wf-gray text-wf-lightgray">
      <div className="w-full">
        <div className="w-full px-4 fixed top-24">
          <h1 className="text-center font-medium text-gray-200">
            Reauthorization required
          </h1>
          <p className="text-md text-center text-gray-400">
            <a
              href={AUTH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Authorize with Webflow{" "}
            </a>
            to generate a token.
          </p>
          <div className="mt-4 px-4 space-y-6">
            <div className="mt-8 space-y-6">
              <input
                id="tokenInput"
                type="text"
                className="bg-[#383838] text-white py-2 px-4 rounded block w-full box-border text-center no-underlinefocus:outline-none focus:ring-gray-500"
                placeholder="Enter auth token"
              />
              <button
                type="submit"
                className="bg-[#383838] text-white py-2 px-4 rounded block text-center w-full box-border no-underline"
                onClick={() => {
                  const newToken = (document.getElementById('tokenInput') as HTMLInputElement)?.value;
                  setToken(newToken);
                  localStorage.setItem("webflow_token", newToken);
                  setPage(1);
                }}
              >
                Authenticate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
