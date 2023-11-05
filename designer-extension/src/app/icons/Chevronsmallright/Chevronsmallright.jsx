/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import PropTypes from "prop-types";

export const Chevronsmallright = ({ className }) => {
  return (
    <svg
      className={`chevronsmallright ${className}`}
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path"
        clipRule="evenodd"
        d="M9.29293 8.00004L6.64648 5.35359L7.35359 4.64648L10.7071 8.00004L7.35359 11.3536L6.64648 10.6465L9.29293 8.00004Z"
        fill="#F5F5F5"
        fillRule="evenodd"
      />
    </svg>
  );
};

Chevronsmallright.propTypes = {
 className: PropTypes.string,
};