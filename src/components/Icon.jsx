const ICON_TONES = {
  primary: "var(--color-primary-500)",
  secondary: "var(--color-neutral-900)",
  neutral: "var(--text-muted)",
  muted: "var(--text-muted)",
  inverse: "var(--color-neutral-0)",
  disabled: "var(--color-neutral-300)",
  success: "var(--color-success-500)",
  warning: "var(--color-warning-500)",
  error: "var(--color-error-500)",
};

export function Icon({ name = "favorite", size = 24, tone = "neutral", style, ...rest }) {
  return (
    <span
      className="material-symbols-outlined"
      style={{
        fontSize: size,
        color: ICON_TONES[tone] || tone,
        lineHeight: 1,
        display: "inline-flex",
        ...style,
      }}
      {...rest}
    >
      {name}
    </span>
  );
}
