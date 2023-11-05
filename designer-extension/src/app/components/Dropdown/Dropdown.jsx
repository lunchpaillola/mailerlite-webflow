/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { Chevronsmalldown } from "../../icons/Chevronsmalldown";
import "./style.css";

export const Dropdown = ({
  value = "Input text...",
  isHovered,
  isFocused,
  isError,
  isDisabled,
  className,
}) => {
  return (
    <div
      className={`dropdown is-disabled-0-${isDisabled} is-error-${isError} is-hovered-0-${isHovered} is-focused-0-${isFocused} ${className}`}
    >
      <div className="content">
        <div className="prefixicon-value">
          <div className="value">{value}</div>
        </div>
        <Chevronsmalldown className="chevron-small-down" />
      </div>
    </div>
  );
};

Dropdown.propTypes = {
  suffixValue: PropTypes.string,
  endValue: PropTypes.bool,
  startIcon: PropTypes.bool,
  value: PropTypes.string,
  density: PropTypes.oneOf(["compact"]),
  isHovered: PropTypes.bool,
  isFocused: PropTypes.bool,
  isError: PropTypes.bool,
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
};
