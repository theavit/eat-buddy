const STACK_COLORS = ["var(--color-primary-500)", "var(--color-primary-600)", "#8FA36A", "#C97A44"];

export function stackAvatarStyle(index, { overlap = true } = {}) {
  return {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: STACK_COLORS[index % STACK_COLORS.length],
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    fontWeight: 700,
    border: "2px solid var(--color-neutral-0)",
    flexShrink: 0,
    ...(overlap && index > 0
      ? {
          marginLeft: -9,
        }
      : null),
  };
}

export const STACK_MORE_STYLE = {
  width: 28,
  height: 28,
  borderRadius: "50%",
  background: "var(--color-neutral-100)",
  color: "var(--text-muted)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 10,
  fontWeight: 700,
  border: "2px solid var(--color-neutral-0)",
  marginLeft: -9,
};

export const CARD_GRADIENTS = [
  "linear-gradient(135deg,#FDE2C8,#F7AB73)",
  "linear-gradient(135deg,#E4EBD3,#A9BC85)",
  "linear-gradient(135deg,#FEF3EA,#F0A05E)",
  "linear-gradient(135deg,#FBD9B7,#E8834A)",
];

const tagPillStyle = (background, color) => ({
  padding: "4px 12px",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 600,
  background,
  color,
});

export const RATING_TAG_STYLES = {
  "Recommended!": tagPillStyle("#E8F3E3", "#4C7A2E"),
  "Highly recommend!": tagPillStyle("var(--color-primary-50)", "var(--color-primary-700)"),
  "Love it!": tagPillStyle("#FDEBD8", "#B8642A"),
};

export const INPUT_STYLE = {
  width: "100%",
  height: 44,
  padding: "0 14px",
  border: "1px solid var(--border-default)",
  borderRadius: 12,
  background: "var(--color-neutral-0)",
  color: "var(--text-body)",
  fontFamily: "var(--font-family-base)",
  fontSize: 14,
  boxSizing: "border-box",
};

export const triggerStyle = (open, invalid) => ({
  ...INPUT_STYLE,
  display: "flex",
  alignItems: "center",
  gap: 10,
  textAlign: "left",
  cursor: "pointer",
  borderColor: invalid
    ? "var(--color-error-500)"
    : open
      ? "var(--color-primary-500)"
      : "var(--border-default)",
  boxShadow: open ? "0 0 0 3px var(--color-primary-50)" : "none",
  transition: "border-color .15s ease, box-shadow .15s ease",
});

export const DROPDOWN_STYLE = {
  position: "absolute",
  left: 0,
  zIndex: 40,
  minWidth: "100%",
  background: "var(--color-neutral-0)",
  border: "1px solid var(--border-default)",
  borderRadius: 14,
  boxShadow: "var(--shadow-lg)",
  padding: 6,
  animation: "eb-pop .14s ease",
  boxSizing: "border-box",
};

export const LABEL_STYLE = {
  fontSize: "var(--type-label-size)",
  fontWeight: "var(--type-label-weight)",
  color: "var(--text-heading)",
};

export const PRIMARY_BUTTON_STYLE = {
  width: "100%",
  boxSizing: "border-box",
  fontFamily: "var(--font-family-base)",
  fontSize: "var(--type-button-size)",
  lineHeight: "var(--type-button-line)",
  fontWeight: "var(--type-button-weight)",
  border: "1px solid transparent",
  borderRadius: "var(--radius-pill)",
  padding: "12px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  background: "var(--color-primary-500)",
  color: "var(--text-on-primary)",
  outline: "none",
};

export const CARD_STYLE = {
  background: "var(--color-neutral-0)",
  border: "1px solid var(--border-default)",
  borderRadius: 20,
  padding: 20,
  boxShadow: "var(--shadow-xs)",
};

export const PANEL_STYLE = {
  background: "var(--color-neutral-0)",
  border: "1px solid var(--border-default)",
  borderRadius: 20,
  padding: 24,
};

export const CLOSE_BUTTON_STYLE = {
  position: "absolute",
  top: 14,
  right: 14,
  width: 32,
  height: 32,
  borderRadius: "50%",
  border: "none",
  background: "rgba(255,255,255,.9)",
  cursor: "pointer",
};
