import { useState } from "react";
import { INPUT_STYLE } from "../styles/shared";
import { Icon } from "./Icon";

export function PasswordInput({ value, onChange, placeholder, invalid, autoComplete }) {
  const [visible, setVisible] = useState(false);
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 14,
          display: "flex",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <Icon name="lock" size={18} tone="muted" />
      </span>
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        style={{
          ...INPUT_STYLE,
          height: 48,
          padding: "0 46px 0 42px",
          borderColor: invalid ? "var(--color-error-500)" : "var(--border-default)",
        }}
      />
      <button
        type="button"
        onClick={() => setVisible((shown) => !shown)}
        aria-label={visible ? "Hide password" : "Show password"}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 8,
          width: 32,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={visible ? "visibility" : "visibility_off"} size={18} tone="muted" />
      </button>
    </div>
  );
}
