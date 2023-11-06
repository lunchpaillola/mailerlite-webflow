/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Chevronsmalldown } from "../../icons/Chevronsmalldown";
import "./style.css";

export const Dropdown = ({
  options, // new prop for the options to be displayed
  value, // this will now be the selected value
  onChange, // new prop: a callback function when the selected value changes
  isHovered,
  isFocused,
  isError,
  isDisabled,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false); // new state to handle dropdown open/close

  return (
    <div>
      <div
        className={`content ${className}`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen(!isOpen);
          }
        }}
        role="button"
        tabIndex={0} // Allows the div to be focused and respond to keyboard inputs
      >
        <div className="prefix-value">
          <div className="value">{value}</div>
        </div>
        <Chevronsmalldown className="chevron-small-down" />
      </div>
      {isOpen && (
        <ul className="dropdown-options">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => {
                onChange(option); // call the callback function when an option is clicked
                setIsOpen(false); // close the dropdown
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onChange(option); // also respond to enter or space press
                  setIsOpen(false);
                }
              }}
              role="menuitem" // Proper role for items within a menu
              tabIndex={0} // Allows each option to be focused and respond to keyboard inputs
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}  

Dropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  onChange: PropTypes.func,
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
