/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const Divider = ({ orientation, elevation, className }) => {
  return <div className={`divider ${elevation} ${orientation} ${className}`} />;
};

Divider.propTypes = {
  orientation: PropTypes.oneOf(["vertical", "horizontal"]),
  elevation: PropTypes.oneOf(["two", "three", "one"]),
  className: PropTypes.string,
};
