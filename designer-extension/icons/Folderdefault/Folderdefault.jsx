/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import PropTypes from "prop-types";

export const Folderdefault = ({ className }) => {
  return (
    <svg
      className={`folderdefault ${className}`}
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path"
        clipRule="evenodd"
        d="M2 4C2 3.44772 2.44772 3 3 3H6.70711L8.70711 5H13C13.5523 5 14 5.44772 14 6V12C14 12.5523 13.5523 13 13 13H3C2.44771 13 2 12.5523 2 12V4ZM6.29289 4H3V12H13V6H8.29289L6.29289 4Z"
        fill="#F5F5F5"
        fillRule="evenodd"
      />
    </svg>
  );
};

Folderdefault.propTypes = {
  className: PropTypes.string,
 };