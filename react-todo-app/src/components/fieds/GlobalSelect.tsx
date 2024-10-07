import React from "react";
import { useField } from "formik";
import classnames from "classnames";
import RSelect from "react-select";
import styles from "./fields.module.scss";

interface SelectProps {
  name?: string;
  id?: string;
  placeholder?: string;
  label?: string;
  options?: object[];
  disabled?: boolean;
  disabledPlaceholder?: boolean;
  style?: React.ReactNode;
  onChange?: (event: any) => void;
  onChangeCapture?: () => void;
  className?: React.ReactNode;
  value?: object;
  required?: boolean;
  isClearable?: boolean;
}

export function ReactSelect({
  name = "",
  id,
  placeholder = "Please select",
  label,
  options,
  disabled,
  onChange,
  value,
  className = null,
  required,
  isClearable,
}: SelectProps) {
  const [field, meta] = useField(name);
  const isInvalid = meta.error && meta.touched;

  return (
    <div className={classnames(styles.field, className)}>
      {label && (
        <label htmlFor={id || name} className={styles.label}>
          {label} {""} {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}

      <RSelect
        placeholder={placeholder}
        {...field}
        id={id}
        name={name}
        options={options}
        value={value}
        onChange={onChange}
        className={classnames(className, isInvalid && styles.invalid)}
        isDisabled={disabled}
        isClearable={isClearable}
      />

      {isInvalid && <p className={styles.error}>{meta.error}</p>}
    </div>
  );
}
