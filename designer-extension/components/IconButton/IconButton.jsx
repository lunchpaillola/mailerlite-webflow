/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { More } from "../../icons/More";
import "./style.css";

export const IconButton = ({
  density,
  colorVariant,
  variant,
  isDisabled,
  isFocused,
  isHovered,
  className,
  icon = <More className="more-1" color="white" />,
}) => {
  return (
    <div
      className={`icon-button ${colorVariant} ${density} is-disabled-${isDisabled} ${variant} is-focused-${isFocused} is-hovered-${isHovered} ${className}`}
    >
      {!isFocused && <>{icon}</>}

      {isFocused && (
        <>
          <More className="more-1" color="white" />
          <div className="focus" />
        </>
      )}
    </div>
  );
};

IconButton.propTypes = {
  density: PropTypes.oneOf(["comfortable", "compact"]),
  colorVariant: PropTypes.oneOf(["primary", "danger", "default"]),
  variant: PropTypes.oneOf(["solid", "outline", "ghost"]),
  isDisabled: PropTypes.bool,
  isFocused: PropTypes.bool,
  isHovered: PropTypes.bool,
  icon: PropTypes.element,
  className: PropTypes.string,
};
