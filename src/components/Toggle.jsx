import { useState } from "react";

export function Toggle({ checked, onChange }) {
  const [internalChecked, setInternalChecked] = useState(!!checked);
  const isOn = checked !== undefined ? checked : internalChecked;
  return (
    <span
      onClick={() => (onChange ? onChange(!isOn) : setInternalChecked(!isOn))}
      style={{
        width: 44,
        height: 26,
        borderRadius: "var(--radius-pill)",
        background: isOn ? "var(--color-primary-500)" : "var(--color-neutral-300)",
        display: "inline-flex",
        alignItems: "center",
        padding: "3px",
        cursor: "pointer",
        flexShrink: 0,
        transition: "background .15s ease",
      }}
    >
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "var(--shadow-xs)",
          transform: isOn ? "translateX(18px)" : "translateX(0)",
          transition: "transform .15s ease",
        }}
      />
    </span>
  );
}
