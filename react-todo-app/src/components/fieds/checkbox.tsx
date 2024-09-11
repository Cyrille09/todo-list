import { Field } from "formik";

interface CheckboxProps {
  type?: string;
  name?: string;
  id?: string;
  value?: string;
  onChangeCapture?: () => void;
  select?: string;
  onChange?: (value: {}) => void;
  onClick?: () => void;
}
export function Checkbox({
  type,
  id,
  name,
  value,
  onChange,
  onClick,
}: CheckboxProps) {
  return (
    <div>
      <label htmlFor={id || name} className="form-check">
        <Field
          type={type}
          name={name}
          id={id}
          className="form-check-input"
          onChangeCapture={onChange}
          onClick={onClick}
        />
        <span
          className="form-check-label"
          style={{ marginLeft: 10, marginTop: 2 }}
        >
          {value}
        </span>
      </label>
    </div>
  );
}

export function CheckboxLocationsAreas({
  type,
  id,
  name,
  value,
  onChangeCapture,
  select = "",
}: CheckboxProps) {
  return (
    <>
      <label
        htmlFor={id || name}
        className="form-check"
        style={{
          marginBottom: 5,
          padding: "5px 0",
          width: "100%",
          display: "flex",
        }}
      >
        <span
          className="form-check-label"
          style={{ fontWeight: 500, fontSize: "110%" }}
        >
          {value}
        </span>
        <span style={{ marginLeft: "auto", marginRight: "20px" }}>
          <Field
            type={type}
            name={name}
            id={id}
            className="form-check-input"
            onChangeCapture={onChangeCapture}
          />
        </span>
      </label>
    </>
  );
}
