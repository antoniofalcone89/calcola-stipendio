import React from "react";
import PropTypes from "prop-types";

/**
 * Box Component
 * A flexible container component that replaces MUI Box
 * Follows Single Responsibility Principle - provides flexible layout container
 */
const Box = ({
  children,
  component = "div",
  className = "",
  sx, // We'll ignore sx for now since we're not using MUI's styling system
  ...props
}) => {
  const Component = component;
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};

Box.propTypes = {
  children: PropTypes.node,
  component: PropTypes.elementType,
  className: PropTypes.string,
  sx: PropTypes.object, // Ignored in our implementation
};

export default Box;
