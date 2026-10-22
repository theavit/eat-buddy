import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV_ITEMS } from "../data/navigation";
import { NOTIFICATIONS } from "../data/notifications";
import { useApp } from "../state/AppContext";
import { Icon } from "./Icon";
import logoLockup from "../assets/logo-lockup.png";

const COLLAPSE_BUTTON_STYLE = {
  width: 24,
  height: 24,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 6,
  border: "1px solid var(--border-default)",
  background: "var(--color-neutral-0)",
  color: "var(--text-muted)",
  cursor: "pointer",
  padding: 0,
};

function navItemStyle(active, sidebarCollapsed) {
  return {
    display: "flex",
    alignItems: "center",
    gap: 14,
    minHeight: 48,
    padding: sidebarCollapsed ? 12 : "12px 16px",
    justifyContent: sidebarCollapsed ? "center" : undefined,
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    fontFamily: "var(--font-family-base)",
    fontSize: 16,
    lineHeight: "24px",
    fontWeight: 500,
    transition: "background-color .15s ease, color .15s ease",
    ...(active
      ? {
          background: "var(--color-primary-50)",
          color: "var(--color-primary-500)",
        }
      : {
          background: "transparent",
          color: "var(--color-neutral-700)",
        }),
  };
}

export function Sidebar() {
  const {
    state,
    go,
    goHome,
    toggleSidebar,
    toggleProfileMenu,
    openProfile,
    openSettings,
    openNotifications,
    signOut,
    patch,
  } = useApp();
  const sidebarCollapsed = state.sidebarCollapsed;
  const user = state.user;
  const unreadCount = NOTIFICATIONS.filter((notification) => notification.unread).length;
  const menuItems = [
    {
      label: "My profile",
      icon: "person",
      onClick: openProfile,
    },
    {
      label: "Account settings",
      icon: "settings",
      onClick: openSettings,
    },
    {
      label: "Log out",
      icon: "logout",
      onClick: signOut,
    },
  ];
  const profileMenuOpen = state.profileMenuOpen;
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState(null);
  useLayoutEffect(() => {
    if (!profileMenuOpen) {
      setMenuPosition(null);
      return;
    }
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setMenuPosition(
        sidebarCollapsed
          ? {
              left: rect.right + 8,
              bottom: window.innerHeight - rect.bottom,
            }
          : {
              left: rect.left,
              bottom: window.innerHeight - rect.top + 8,
            },
      );
    }
  }, [profileMenuOpen, sidebarCollapsed]);
  useEffect(() => {
    if (!profileMenuOpen) {
      return;
    }
    const closeMenu = () =>
      patch({
        profileMenuOpen: false,
      });
    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target) && !triggerRef.current?.contains(event.target)) {
        closeMenu();
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", closeMenu);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", closeMenu);
    };
  }, [profileMenuOpen, patch]);
  return (
    <aside
      style={{
        width: sidebarCollapsed ? 76 : 224,
        flexShrink: 0,
        background: "var(--color-neutral-0)",
        borderRight: "1px solid var(--border-default)",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "width .18s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          margin: "16px 0 10px 20px",
        }}
      >
        {sidebarCollapsed ? (
          <div
            onClick={goHome}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "var(--color-primary-500)",
              color: "var(--text-on-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            EB
          </div>
        ) : (
          <>
            <img
              src={logoLockup}
              alt="Eat Buddy"
              onClick={goHome}
              style={{
                width: 150,
                height: "auto",
                objectFit: "contain",
                objectPosition: "left center",
                cursor: "pointer",
              }}
            />
            <button
              onClick={toggleSidebar}
              style={{
                ...COLLAPSE_BUTTON_STYLE,
                marginRight: 16,
              }}
            >
              <Icon name="chevron_left" size={14} tone="secondary" />
            </button>
          </>
        )}
      </div>
      {sidebarCollapsed && (
        <button
          onClick={toggleSidebar}
          style={{
            ...COLLAPSE_BUTTON_STYLE,
            margin: "0 0 8px 20px",
          }}
        >
          <Icon name="chevron_right" size={14} tone="secondary" />
        </button>
      )}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          padding: "8px 12px",
        }}
      >
        {NAV_ITEMS.map((navItem) => {
          const active = state.tab === navItem.key;
          return (
            <button
              onClick={() => go(navItem.key)}
              title={navItem.label}
              style={navItemStyle(active, sidebarCollapsed)}
              key={navItem.key}
            >
              <Icon name={navItem.icon} size={24} tone={active ? "primary" : "secondary"} />
              {!sidebarCollapsed && navItem.label}
            </button>
          );
        })}
        <button
          onClick={openNotifications}
          title="Notifications"
          style={navItemStyle(false, sidebarCollapsed)}
        >
          <span
            style={{
              position: "relative",
              display: "inline-flex",
            }}
          >
            <Icon name="notifications" size={24} tone="secondary" />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -3,
                  right: -5,
                  minWidth: 15,
                  height: 15,
                  padding: "0 3px",
                  borderRadius: 8,
                  background: "var(--color-primary-500)",
                  color: "#fff",
                  fontSize: 9,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {unreadCount}
              </span>
            )}
          </span>
          {!sidebarCollapsed && "Notifications"}
        </button>
      </nav>
      <div
        style={{
          marginTop: "auto",
          padding: "10px 12px",
          borderTop: "1px solid var(--border-default)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <div
          style={{
            position: "relative",
          }}
        >
          <button
            ref={triggerRef}
            onClick={toggleProfileMenu}
            title={sidebarCollapsed ? user.name : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: 8,
              borderRadius: 12,
              width: "100%",
              justifyContent: sidebarCollapsed ? "center" : undefined,
            }}
          >
            <span
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: state.vibeColor,
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {user.initials}
            </span>
            {!sidebarCollapsed && (
              <>
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    lineHeight: 1.2,
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: "var(--type-body-sm-size)",
                      fontWeight: 600,
                      color: "var(--text-heading)",
                    }}
                  >
                    {user.firstName}
                  </span>
                  <span
                    style={{
                      fontSize: "var(--type-caption-size)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {user.dept}
                  </span>
                </span>
                <span
                  style={{
                    color: "var(--text-muted)",
                    fontSize: 12,
                  }}
                >
                  ▾
                </span>
              </>
            )}
          </button>
          {profileMenuOpen && menuPosition && (
            <div
              ref={menuRef}
              style={{
                position: "fixed",
                left: menuPosition.left,
                bottom: menuPosition.bottom,
                width: 230,
                background: "var(--color-neutral-0)",
                border: "1px solid var(--border-default)",
                borderRadius: 16,
                boxShadow: "var(--shadow-lg)",
                padding: 8,
                zIndex: 80,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                animation: "eb-pop .14s ease",
              }}
            >
              <div
                style={{
                  padding: "10px 12px 12px",
                  borderBottom: "1px solid var(--border-default)",
                  marginBottom: 6,
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text-heading)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.name}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.email}
                </span>
              </div>
              {menuItems.map((item) => (
                <button
                  onClick={item.onClick}
                  className="eb-menu-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "10px 12px",
                    border: "none",
                    background: "transparent",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontFamily: "var(--font-family-base)",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--text-heading)",
                    textAlign: "left",
                  }}
                  key={item.label}
                >
                  <Icon name={item.icon} size={20} tone="secondary" />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
