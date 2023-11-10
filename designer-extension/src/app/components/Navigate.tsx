"use client";
import React from "react";
import {NavigateProps } from "../types/globalTypes";
import "./style.css";

const Navigate: React.FC<NavigateProps> = ({ setPage }) => {
  return (
    <div className="flex flex-col items-center justify-center py-4 px-4 bg-wf-gray text-wf-lightgray h-screen overflow-auto">
    <div className="text-center space-y-4 flex flex-col h-full justify-between pb-4">
      <div>
        <div className="flex justify-start fixed top-2 bottom 4">
          <button
            onClick={() => {
              setPage(0);
            }}
            className="text-sm font-regular text-left"
            style={{ color: "#fff" }}
          >
            <span className="inline-block">{"<"}</span> Back
          </button>
        </div>
        <h1 className="text-md font-medium text-left text-gray-200 mb-2 mt-4">
          Choose your action
        </h1>
        {/* Button container should not be flex or justify-between */}
        <div className="mt-8">
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
            }}
          >
            Connect new form
          </button>
        </div>
        <div className="mt-8">
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
  </div>
  
  );
};

export default Navigate;
