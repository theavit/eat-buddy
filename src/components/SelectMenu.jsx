import { usePopover } from "../hooks/usePopover";
import { DROPDOWN_STYLE, triggerStyle } from "../styles/shared";
import { Icon } from "./Icon";

export function SelectMenu({ icon, value, onChange, options, placeholder = "Select…" }) {
  const { open, setOpen, toggle, dropUp, ref } = usePopover(260);
  return (
    <div
      ref={ref}
      style={{
        position: "relative",
      }}
    >
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={triggerStyle(open)}
      >
        {icon && <Icon name={icon} size={18} tone="secondary" />}
        <span
          style={{
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: value ? "var(--text-body)" : "var(--text-muted)",
          }}
        >
          {value || placeholder}
        </span>
        <Icon
          name="expand_more"
          size={18}
          tone="secondary"
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform .15s ease",
          }}
        />
      </button>
      {open && (
        <div
          role="listbox"
          style={{
            ...DROPDOWN_STYLE,
            right: 0,
            maxHeight: 240,
            overflowY: "auto",
            ...(dropUp
              ? {
                  bottom: "calc(100% + 6px)",
                }
              : {
                  top: "calc(100% + 6px)",
                }),
          }}
        >
          {options.map((option) => {
            const selected = option === value;
            return (
              <div
                role="option"
                aria-selected={selected}
                className="eb-option"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  padding: "9px 12px",
                  borderRadius: 9,
                  fontSize: 14,
                  cursor: "pointer",
                  background: selected ? "var(--color-primary-500)" : "transparent",
                  color: selected ? "var(--text-on-primary)" : "var(--text-body)",
                  fontWeight: selected ? 600 : 400,
                }}
                key={option}
              >
                {option}
                {selected && <Icon name="check" size={16} tone="inverse" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
