import React, { useState } from "react";
import PropTypes from "prop-types";

/**
 * TextField Component
 * A customizable text input component that replaces MUI TextField
 * Follows Single Responsibility Principle - handles text input with label and error states
 */
const TextField = React.forwardRef(
  (
    {
      label,
      type,
      value,
      defaultValue,
      onChange,
      onBlur,
      onFocus,
      error = false,
      helperText,
      disabled = false,
      required = false,
      fullWidth = true,
      placeholder,
      className = "",
      InputProps = {},
      children,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue || "");

    // Use controlled or uncontrolled pattern
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const handleChange = (e) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleFocus = (e) => {
      onFocus?.(e);
    };

    const handleBlur = (e) => {
      onBlur?.(e);
    };

    // Build CSS classes
    const inputClasses = [
      "input",
      error ? "input-error" : "",
      disabled ? "disabled" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const containerClasses = ["form-group", fullWidth ? "full-width" : ""]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={containerClasses}>
        {label && (
          <label className={`label ${required ? "label-required" : ""}`}>
            {label}
          </label>
        )}

        <div className="input-adornment">
          <input
            ref={ref}
            type={type}
            value={currentValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            className={inputClasses}
            {...props}
          />

          {(children || InputProps.endAdornment) && (
            <div className="input-adornment-end">
              {children ?? InputProps.endAdornment}
            </div>
          )}
        </div>

        {helperText && (
          <div className={`helper-text ${error ? "error" : ""}`}>
            {helperText}
          </div>
        )}
      </div>
    );
  },
);

TextField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.oneOf([
    "text",
    "email",
    "password",
    "number",
    "tel",
    "url",
    "date",
    "time",
  ]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  InputProps: PropTypes.object,
  children: PropTypes.node,
};

TextField.displayName = "TextField";

export default TextField;
