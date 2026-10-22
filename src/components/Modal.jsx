import { useEffect } from "react";
import { useApp } from "../state/AppContext";

const MODAL_BACKDROP_STYLE = {
  position: "fixed",
  inset: 0,
  background: "rgba(26,20,16,.5)",
  zIndex: 100,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
};

const DRAWER_BACKDROP_STYLE = {
  position: "fixed",
  inset: 0,
  background: "rgba(26,20,16,.35)",
  zIndex: 100,
};

const DRAWER_PANEL_STYLE = {
  position: "absolute",
  top: 0,
  right: 0,
  height: "100%",
  width: 480,
  maxWidth: "92vw",
  background: "var(--color-neutral-0)",
  boxShadow: "var(--shadow-xl)",
  animation: "eb-slide .2s ease",
  overflowY: "auto",
};

export function Modal({ children, maxWidth = 520, panelStyle }) {
  const { closeModal } = useApp();
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModal]);
  return (
    <div style={MODAL_BACKDROP_STYLE} onClick={closeModal}>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        style={{
          background: "var(--color-neutral-0)",
          borderRadius: 24,
          boxShadow: "var(--shadow-xl)",
          maxWidth,
          width: "100%",
          maxHeight: "88vh",
          overflowY: "auto",
          animation: "eb-pop .18s ease",
          ...panelStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function Drawer({ children, width }) {
  const { closeModal } = useApp();
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModal]);
  return (
    <div style={DRAWER_BACKDROP_STYLE} onClick={closeModal}>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        style={{
          ...DRAWER_PANEL_STYLE,
          ...(width
            ? {
                width,
              }
            : null),
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ title, children }) {
  const { closeModal } = useApp();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 600,
          color: "var(--text-heading)",
        }}
      >
        {title}
      </h2>
      {children ?? (
        <button
          onClick={closeModal}
          aria-label="Close"
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1px solid var(--border-default)",
            background: "none",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
