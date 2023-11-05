/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import PropTypes from "prop-types";

export const Chevronsmalldown = ({ className }) => {
  return (
    <svg
      className={`chevronsmalldown ${className}`}
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path"
        clipRule="evenodd"
        d="M7.99996 9.29293L10.6464 6.64648L11.3535 7.35359L7.99996 10.7071L4.64641 7.35359L5.35352 6.64648L7.99996 9.29293Z"
        fill="#F5F5F5"
        fillRule="evenodd"
      />
    </svg>
  );
};

Chevronsmalldown.propTypes = {
 className: PropTypes.string,
};
