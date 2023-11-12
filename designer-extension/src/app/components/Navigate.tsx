"use client";
import React from "react";
import { NavigateProps } from "../types/globalTypes";
import "./style.css";

const Navigate: React.FC<NavigateProps> = ({ setPage }) => {
  return (
    <div className="flex items-center min-h-screen py-2 bg-wf-gray text-wf-lightgray">
      <div className="w-full">
        {/* Top section with back button*/}
        <div className="px-4 fixed top-2">
          <button
            onClick={() => {
              setPage(0);
              console.log("setPage", setPage);
            }}
            className="flex items-center text-sm font-regular text-white text-left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>{" "}
            Back
          </button>
        </div>
        <div className="w-full fixed top-16">
          <h1 className="text-center text-md font-medium text-gray-200">
            Webflow to Mailerlite
          </h1>
          <p className="text-sm text-center text-gray-400">Manage your forms</p>
        </div>
        {/* Buttons that should be centered */}
        <div className="w-full px-8 flex flex-col">
          <button
            onClick={() => setPage(2)}
            style={{
              backgroundColor: "#383838",
              color: "white",
              padding: "8px 16px",
              borderRadius: "4px",
              outline: "none",
              width: "100%",
              boxSizing: "border-box",
              marginBottom: "24px", // Add some space between the buttons
            }}
          >
            Connect new form
          </button>
          <button
            onClick={() => setPage(4)}
            style={{
              backgroundColor: "#383838",
              color: "white",
              padding: "8px 16px",
              borderRadius: "4px",
              outline: "none",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            View connections
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navigate;
