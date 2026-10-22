import { NAV_ITEMS } from "../data/navigation";
import { NOTIFICATIONS } from "../data/notifications";
import { useApp } from "../state/AppContext";
import { Icon } from "./Icon";

export const BOTTOM_NAV_HEIGHT = 62;

export function BottomNav() {
  const { state, go, openNotifications, openProfile } = useApp();
  const badge = NOTIFICATIONS.filter((notification) => notification.unread).length;
  const items = [
    ...NAV_ITEMS,
    {
      key: "__notifications",
      label: "Alerts",
      icon: "notifications",
      badge,
    },
    {
      key: "__profile",
      label: state.user.firstName,
      icon: "person",
    },
  ];
  const select = (key) =>
    key === "__notifications" ? openNotifications() : key === "__profile" ? openProfile() : go(key);
  return (
    <nav
      aria-label="Main"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 40,
        height: BOTTOM_NAV_HEIGHT,
        display: "grid",
        gridTemplateColumns: `repeat(${items.length}, 1fr)`,
        background: "var(--color-neutral-0)",
        borderTop: "1px solid var(--border-default)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        boxShadow: "0 -2px 12px rgba(0,0,0,.05)",
      }}
    >
      {items.map((item) => {
        const active =
          item.key === state.tab || (item.key === "__profile" && state.tab === "profile");
        return (
          <button
            type="button"
            onClick={() => select(item.key)}
            aria-current={active ? "page" : undefined}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              border: "none",
              background: "none",
              cursor: "pointer",
              padding: "6px 2px",
              fontFamily: "var(--font-family-base)",
              fontSize: 10,
              fontWeight: 600,
              lineHeight: "12px",
              color: active ? "var(--color-primary-500)" : "var(--text-muted)",
            }}
            key={item.key}
          >
            <span
              style={{
                position: "relative",
                display: "flex",
              }}
            >
              <Icon name={item.icon} size={22} tone={active ? "primary" : "muted"} />
              {item.badge > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -6,
                    minWidth: 15,
                    height: 15,
                    padding: "0 4px",
                    borderRadius: 999,
                    background: "var(--color-primary-500)",
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </span>
            <span
              style={{
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
