import { Drawer, ModalHeader } from "../components/Modal";
import { NOTIFICATIONS } from "../data/notifications";

export function NotificationsDrawer() {
  return (
    <Drawer width={380}>
      <div
        style={{
          padding: 24,
        }}
      >
        <div
          style={{
            marginBottom: 16,
          }}
        >
          <ModalHeader title="Notifications" />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {NOTIFICATIONS.map((notification) => (
            <div
              style={{
                display: "flex",
                gap: 12,
                padding: "12px 8px",
                borderRadius: 12,
                position: "relative",
                background: notification.unread ? "var(--color-primary-50)" : "transparent",
              }}
              key={notification.id}
            >
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "var(--color-primary-100)",
                  color: "var(--color-primary-700)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {notification.initials}
              </span>
              <div
                style={{
                  flex: 1,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    color: "var(--text-heading)",
                  }}
                >
                  {notification.message}
                </p>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                  }}
                >
                  {notification.time}
                </span>
              </div>
              {notification.unread && (
                <span
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 6,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--color-primary-500)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
}
