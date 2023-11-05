/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";

export const Closedefault1 = ({ color = "#BDBDBD", className }) => {
  return (
    <svg
      className={`closedefault-1 ${className}`}
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path"
        clipRule="evenodd"
        d="M8.70714 7.99998L12.3536 4.35353L11.6465 3.64642L8.00004 7.29287L4.35359 3.64642L3.64648 4.35353L7.29293 7.99998L3.64648 11.6464L4.35359 12.3535L8.00004 8.70708L11.6465 12.3535L12.3536 11.6464L8.70714 7.99998Z"
        fill={color}
        fillRule="evenodd"
      />
    </svg>
  );
};

Closedefault1.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string,
};
