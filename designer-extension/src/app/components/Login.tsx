"use client";
import React from "react";
import { LoginProps } from "../types/globalTypes";
// Add your auth URL here
const AUTH_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const Login: React.FC<LoginProps> = ({
  setPage,
  token,
}: {
  setPage: any;
  token: any;
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
            Connect your Webflow account to continue.
          </p>
          <div className="mt-4 px-4 space-y-6">
            <button
              onClick={() =>
                window.open(AUTH_URL, "_blank", "noopener,noreferrer")
              }
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
              Connect to Webflow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
