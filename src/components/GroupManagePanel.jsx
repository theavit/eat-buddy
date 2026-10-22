import { initialsOf } from "../lib/format";
import { useApp } from "../state/AppContext";
import { CARD_STYLE, stackAvatarStyle } from "../styles/shared";
import { Button } from "./Button";

export function GroupManagePanel() {
  const { state, copyGroupCode, removeMember, confirmLeaveGroup, openCreateLunch } = useApp();
  const selectedGroup = state.groups.find((group) => group.id === state.selectedGroupId);
  if (!selectedGroup) {
    return null;
  }
  const isAdmin = selectedGroup.isAdmin;
  const members = selectedGroup.memberRows || [];
  const copied = state.copiedCode === selectedGroup.code;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div style={CARD_STYLE}>
        <h3
          style={{
            margin: "0 0 4px",
            fontSize: 17,
            fontWeight: 600,
            color: "var(--text-heading)",
          }}
        >
          Manage group
        </h3>
        <p
          style={{
            margin: "0 0 16px",
            fontSize: 13,
            color: "var(--text-muted)",
          }}
        >
          {selectedGroup.name}
        </p>
        <p
          style={{
            margin: "0 0 6px",
            fontSize: 12,
            fontWeight: 500,
            color: "var(--text-muted)",
          }}
        >
          Share this code so others can join the group
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            padding: "12px 14px",
            border: "1px dashed var(--border-default)",
            borderRadius: 12,
            background: "#FFFBF7",
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 2,
              color: "var(--text-heading)",
            }}
          >
            {selectedGroup.code}
          </span>
          <Button variant="outline" size="sm" onClick={() => copyGroupCode(selectedGroup.code)}>
            {copied ? "Copied!" : "Copy code"}
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {members.map((member, index) => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                padding: "6px 4px",
              }}
              key={member.id}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text-heading)",
                }}
              >
                <span
                  style={stackAvatarStyle(index, {
                    overlap: false,
                  })}
                >
                  {initialsOf(member.name)}
                </span>
                {member.name}
                {member.role === "admin" && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--text-muted)",
                    }}
                  >
                    Admin
                  </span>
                )}
              </span>
              {isAdmin && member.id !== state.user.id && (
                <button
                  onClick={() => removeMember(selectedGroup.id, member.id)}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--text-muted)",
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          ...CARD_STYLE,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <Button
          variant="primary"
          onClick={() => openCreateLunch(selectedGroup.id)}
          style={{
            width: "100%",
          }}
        >
          + Plan a meal
        </Button>
        <button
          onClick={() => confirmLeaveGroup(selectedGroup.id)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            fontFamily: "var(--font-family-base)",
            fontSize: "var(--type-button-size)",
            lineHeight: "var(--type-button-line)",
            fontWeight: "var(--type-button-weight)",
            borderRadius: "var(--radius-pill)",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor: "pointer",
            background: "transparent",
            color: "var(--text-muted)",
            border: "1px solid var(--border-default)",
          }}
        >
          Leave Group
        </button>
      </div>
    </div>
  );
}
