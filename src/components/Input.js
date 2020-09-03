import React from "react";
import classNames from "classnames";
import { string, func, bool } from "prop-types";

const Input = ({ label, type, value, name,
  placeHolder, extraClass, onChange,
  onBlur, required, validationError, readOnly
}) => {
  return (
    <div
      className={classNames("form-group", extraClass, {
        "has-danger": validationError
      })}
    >
      {label ? <label>{label}</label> : null}
      <input
        type={type}
        value={value}
        name={name}
        placeholder={placeHolder}
        onChange={onChange}
        onBlur={onBlur}
        className="form-control"
        required={required}
        readOnly={readOnly}
      />
      {validationError && (
        <div className="form-control-feedback">{validationError}</div>
      )}
    </div>
  );
};

Input.propTypes = {
  label: string,
  type: string,
  name: string,
  placeHolder: string,
  extraClass: string,
  onChange: func,
  onBlur: func,
  validationError: string,
  required: bool,
  readOnly: bool,
};

export default Input;
