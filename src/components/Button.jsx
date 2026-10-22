const BUTTON_PADDING = {
  md: "12px 24px",
  sm: "8px 16px",
};

const BUTTON_VARIANTS = {
  primary: {
    background: "var(--color-primary-500)",
    color: "var(--text-on-primary)",
  },
  secondary: {
    background: "var(--color-secondary-500)",
    color: "var(--text-on-dark)",
  },
  outline: {
    background: "transparent",
    color: "var(--color-primary-500)",
    borderColor: "var(--color-primary-500)",
  },
  ghost: {
    background: "transparent",
    color: "var(--color-primary-500)",
  },
  text: {
    background: "transparent",
    color: "var(--color-primary-500)",
    padding: "4px 2px",
    borderRadius: 0,
  },
};

export function Button({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  loading = false,
  disabled = false,
  children,
  onClick,
  style,
  ...rest
}) {
  const baseStyle = {
    fontFamily: "var(--font-family-base)",
    fontSize: "var(--type-button-size)",
    lineHeight: "var(--type-button-line)",
    fontWeight: "var(--type-button-weight)",
    border: "1px solid transparent",
    borderRadius: "var(--radius-pill)",
    padding: BUTTON_PADDING[size],
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
    transition:
      "background-color .15s ease, color .15s ease, border-color .15s ease, transform .08s ease",
    opacity: disabled ? 0.45 : 1,
    outline: "none",
  };
  return (
    <button
      style={{
        ...baseStyle,
        ...BUTTON_VARIANTS[variant],
        ...style,
      }}
      disabled={disabled || loading}
      onClick={onClick}
      data-variant={variant}
      {...rest}
    >
      {loading ? (
        <span
          style={{
            width: 14,
            height: 14,
            border: "2px solid currentColor",
            borderRightColor: "transparent",
            borderRadius: "50%",
            animation: "ds-spin .7s linear infinite",
          }}
        />
      ) : (
        iconLeft
      )}
      {children}
      {!loading && iconRight}
    </button>
  );
}
