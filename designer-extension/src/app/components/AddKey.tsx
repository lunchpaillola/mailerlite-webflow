"use client";
import React from "react";
import { motion } from "framer-motion"; // For animations
import { ApiKeyProps } from "../types/globalTypes";
import "./style.css";

const Login: React.FC<ApiKeyProps> = ({
  setPage,
  token,
  setToken,
}: {
  setPage: any;
  token: any;
  setToken: any;
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen py-2 bg-wf-gray text-wf-lightgray"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-8">
        <div>
          <h1 className="mt-3 text-4xl font-bold text-gray-200 mb-2">
            Connect Mailerlite to Webflow
          </h1>
          <h2 className="mt-3 text-lg text-gray-400 mb-2">
            by Lunch Pail Labs
          </h2>
          <div className="mt-8 space-y-6">
            <input
              type="text"
              onBlur={(e) => {
                setToken(e.target.value);
              }}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter your auth token"
            />
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer border-gray-700"
              onClick={() => {
                localStorage.setItem("webflow_token", token);
                setPage(1);
              }}
            >
              Authenticate
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
