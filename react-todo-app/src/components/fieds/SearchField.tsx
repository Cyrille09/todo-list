import { FaSearch } from "react-icons/fa";
import { useField } from "formik";
import classnames from "classnames";

import { GlobalButton } from "../button/GlobalButton";
import "./fields.scss";

interface InputProps {
  type?: any;
  name: string;
  id: string;
  placeholder?: string;
  label?: string;
  size?: string;
  disabled?: boolean;
  className?: any;
  min?: number;
  required?: boolean;
  max?: number;
  onBlur?: any;
  autoCapitalize?: any;
  onChange?: any;
  autoCorrect?: any;
  value?: any;
  classNameLabel?: any;
  error?: any;
  style?: any;
  onChangeCapture?: any;
  onClick?: any;
  onFocus?: any;
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
