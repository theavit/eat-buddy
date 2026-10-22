import { useState } from "react";

export function Checkbox({ label, checked, onChange }) {
  const [internalChecked, setInternalChecked] = useState(!!checked);
  const isChecked = checked !== undefined ? checked : internalChecked;
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
        fontSize: "var(--type-body-md-size)",
        color: "var(--text-body)",
      }}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => (onChange ? onChange(!isChecked) : setInternalChecked(!isChecked))}
        style={{
          position: "absolute",
          opacity: 0,
          width: 20,
          height: 20,
          margin: 0,
          cursor: "pointer",
        }}
      />
      <span
        aria-hidden="true"
        style={{
          width: 20,
          height: 20,
          borderRadius: "6px",
          border: isChecked ? "none" : "2px solid var(--border-strong)",
          background: isChecked ? "var(--color-primary-500)" : "transparent",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 13,
          flexShrink: 0,
          transition: "all .15s ease",
        }}
      >
        {isChecked ? "✓" : ""}
      </span>
      {label}
    </label>
  );
}
