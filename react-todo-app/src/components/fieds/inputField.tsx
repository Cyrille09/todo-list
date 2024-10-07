import React from "react";
import { useField } from "formik";
import classnames from "classnames";

import styles from "./fields.module.scss";
// import "./fields.module.scss";

interface InputProps {
  type?: string;
  name: string;
  id: string;
  placeholder?: string;
  label?: string;
  size?: "lg" | "sm" | "default";
  disabled?: boolean;
  className?: React.ReactDOM;
  min?: number;
  required?: boolean;
  max?: number;
  onBlur?: (value?: string | object) => void;
  autoCapitalize?: string;
  onChange?: (value: any) => void;
  autoCorrect?: string;
  classNameLabel?: React.ReactDOM;
  error?: React.ReactNode;
  style?: React.CSSProperties;
  onChangeCapture?: (value?: string | object) => void;
  accept?: string;
}

export function InputField({
  type,
  name = "",
  id,
  placeholder,
  label = "",
  size = "default",
  disabled,
  min,
  required,
  max,
  onBlur,
  autoCapitalize,
  onChange,
  autoCorrect,
  classNameLabel,
  style,
  onChangeCapture,
  accept,
}: InputProps) {
  // return field name for an <input />
  const [field, meta] = useField(name);
  const isInvalid = meta.error && meta.touched;

  return (
    <div className={styles.inputWraper}>
      {label && (
        <label
          htmlFor={id || name}
          className={classnames(styles.label, classNameLabel)}
        >
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
      <input
        style={style}
        {...field}
        type={type}
        id={id}
        name={name}
        className={classnames(
          "form-control",
          `form-control-${size}`,
          isInvalid && styles.isInvalid
        )}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        onBlur={onBlur}
        autoCapitalize={autoCapitalize}
        onChange={onChange}
        autoCorrect={autoCorrect}
        onChangeCapture={onChangeCapture}
        accept={accept}
      />
      {isInvalid && <p className={styles.invalidFeedback}>{meta.error}</p>}
    </div>
  );
}
