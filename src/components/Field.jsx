const FIELD_STYLE = {
  fontFamily: "var(--font-family-base)",
  fontSize: "var(--type-body-md-size)",
  color: "var(--text-body)",
  border: "1px solid var(--border-default)",
  borderRadius: "var(--radius-md)",
  padding: "10px 14px",
  outline: "none",
  width: "100%",
  transition: "border-color .15s ease, box-shadow .15s ease",
  background: "var(--color-neutral-0)",
};

function fieldStyle(state) {
  if (state === "error") {
    return {
      ...FIELD_STYLE,
      borderColor: "var(--color-error-500)",
    };
  } else if (state === "success") {
    return {
      ...FIELD_STYLE,
      borderColor: "var(--color-success-500)",
    };
  } else if (state === "disabled") {
    return {
      ...FIELD_STYLE,
      background: "var(--color-neutral-100)",
      color: "var(--text-muted)",
      cursor: "not-allowed",
    };
  } else {
    return FIELD_STYLE;
  }
}

const FIELD_LABEL_STYLE = {
  fontSize: "var(--type-label-size)",
  fontWeight: "var(--type-label-weight)",
  color: "var(--text-heading)",
};

const FIELD_WRAPPER_STYLE = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  width: "100%",
};

export function Select({ label, options = [], ...rest }) {
  return (
    <div style={FIELD_WRAPPER_STYLE}>
      {label && <label style={FIELD_LABEL_STYLE}>{label}</label>}
      <select
        style={{
          ...FIELD_STYLE,
          appearance: "none",
        }}
        {...rest}
      >
        {options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TextInput({ label, placeholder, state, helpText, disabled, ...rest }) {
  const fieldState = disabled ? "disabled" : state;
  return (
    <div style={FIELD_WRAPPER_STYLE}>
      {label && <label style={FIELD_LABEL_STYLE}>{label}</label>}
      <input
        style={fieldStyle(fieldState)}
        placeholder={placeholder}
        disabled={disabled}
        {...rest}
      />
      {helpText && (
        <span
          style={{
            fontSize: "var(--type-caption-size)",
            color:
              fieldState === "error"
                ? "var(--color-error-500)"
                : fieldState === "success"
                  ? "var(--color-success-dark)"
                  : "var(--text-muted)",
          }}
        >
          {helpText}
        </span>
      )}
    </div>
  );
}

export function TextArea({ label, placeholder, rows = 4, ...rest }) {
  return (
    <div style={FIELD_WRAPPER_STYLE}>
      {label && <label style={FIELD_LABEL_STYLE}>{label}</label>}
      <textarea
        style={{
          ...FIELD_STYLE,
          resize: "vertical",
          fontFamily: "var(--font-family-base)",
        }}
        rows={rows}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
}
