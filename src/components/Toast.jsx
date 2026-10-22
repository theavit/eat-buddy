import { useApp } from "../state/AppContext";
import { Icon } from "./Icon";

export function Toast() {
  const { state } = useApp();
  if (state.toast) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          position: "fixed",
          left: "50%",
          top: 28,
          transform: "translateX(-50%)",
          background: "var(--color-neutral-900)",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: 999,
          fontSize: 14,
          fontWeight: 500,
          boxShadow: "var(--shadow-lg)",
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          gap: 8,
          animation: "eb-toast .2s ease",
        }}
      >
        <Icon name="check_circle" size={18} tone="inverse" />
        {state.toast}
      </div>
    );
  } else {
    return null;
  }
}
