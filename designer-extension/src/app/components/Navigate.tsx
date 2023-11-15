"use client";
import React from "react";
import { NavigateProps } from "../types/globalTypes";
import ChevronLeftIcon from '../icons/ChevronLeftIcon';
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
            }}
            className="flex items-center text-sm font-regular text-white text-left"
          >
            <ChevronLeftIcon/>
            Back
          </button>
        </div>
        <div className="w-full fixed top-16">
          <h1 className="text-center text-md font-medium text-gray-200">
            Webflow app
          </h1>
          <p className="text-sm text-center text-gray-400">Manage your forms</p>
        </div>
        {/* Buttons that should be centered */}
        <div className="w-full px-8 flex flex-col">
          <button
            onClick={() => setPage(2)}
            className="bg-[#383838] text-white px-4 py-2 rounded outline-none w-full box-border mb-6"
          >
            Action 1
          </button>
          <button
            onClick={() => setPage(4)}
            className="bg-[#383838] text-white px-4 py-2 rounded outline-none w-full box-border mb-6"
          >
            Action 2
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navigate;
