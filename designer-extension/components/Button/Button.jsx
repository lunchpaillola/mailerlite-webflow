/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const Button = ({
  label = "label",
  colorVariant,
  variant,
  isHovered,
  isFocused,
  isDisabled,
  className,
}) => {
  return (
    <button
      className={`button is-hovered-1-${isHovered} color-variant-${colorVariant} is-disabled-1-${isDisabled} is-focused-1-${isFocused} variant-${variant} ${className}`}
    >
      <div className="label">{label}</div>
      {isFocused && <div className="div" />}
    </button>
  );
};

Button.propTypes = {
  endIcon: PropTypes.bool,
  startIcon: PropTypes.bool,
  label: PropTypes.string,
  density: PropTypes.oneOf(["compact"]),
  colorVariant: PropTypes.oneOf(["primary", "danger", "default"]),
  variant: PropTypes.oneOf(["solid", "outline", "ghost"]),
  isHovered: PropTypes.bool,
  isFocused: PropTypes.bool,
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
};
