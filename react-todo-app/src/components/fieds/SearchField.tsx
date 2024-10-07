import { FaSearch } from "react-icons/fa";
import { useField } from "formik";
import classnames from "classnames";

import { GlobalButton } from "../button/GlobalButton";
import "./fields.scss";
import React from "react";

interface InputProps {
  type?: string;
  name: string;
  id: string;
  placeholder?: string;
  label?: string;
  size?: string;
  disabled?: boolean;
  className?: React.ReactNode;
  min?: number;
  required?: boolean;
  max?: number;
  onBlur?: (value?: string | object) => void;
  autoCapitalize?: string;
  onChange?: (value: any) => void;
  autoCorrect?: string;
  classNameLabel?: React.ReactNode;
  style?: React.CSSProperties;
  onChangeCapture?: (value?: string | object) => void;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  onFocus?: (value?: string | object) => void;
  searchButtonSize?: "lg" | "xl" | "md" | "sm" | "xs" | "none";
}

export const SearchField = ({
  name = "",
  id,
  placeholder = "Search...",
  onBlur,
  autoCapitalize,
  onChange,
  autoCorrect,
  style,
  onChangeCapture,
  onClick,
  searchButtonSize = "xs",
  disabled = false,
  onFocus,
}: InputProps) => {
  const [field] = useField(name);

  return (
    <div className="search-input">
      <input
        style={style}
        {...field}
        type="text"
        id={id}
        name={name}
        className={classnames(`search-text-${searchButtonSize}`)}
        placeholder={placeholder}
        onBlur={onBlur}
        autoCapitalize={autoCapitalize}
        onChange={onChange}
        autoCorrect={autoCorrect}
        onChangeCapture={onChangeCapture}
        onFocus={onFocus}
      />
      <GlobalButton
        format="secondary"
        className="search-submit"
        onClick={onClick}
        disabled={disabled}
      >
        <FaSearch size={20} />
      </GlobalButton>
    </div>
  );
};
