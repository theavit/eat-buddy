import { Button } from "../../components/Button";
import { toGroupViews, toLunchView } from "../../lib/viewModels";
import { useApp } from "../../state/AppContext";
import { PANEL_STYLE, STACK_MORE_STYLE } from "../../styles/shared";

export function GroupsList() {
  const { state, openCreateGroup, openJoinGroup, openGroupDetail, openCreateLunch } = useApp();
  const lunchViews = state.lunches.map((lunch, index) => toLunchView(lunch, index, state.groups));
  const groupViews = toGroupViews(state.groups, lunchViews);
  return (
    <section style={PANEL_STYLE}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 600,
              color: "var(--text-heading)",
            }}
          >
            Groups
          </h1>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 15,
              color: "var(--text-muted)",
            }}
          >
            Create a group, or join one with a code.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <Button variant="outline" onClick={openJoinGroup}>
            Join with code
          </Button>
          <Button variant="primary" onClick={openCreateGroup}>
            + Create a Group
          </Button>
        </div>
      </div>
      {state.groupsError && (
        <div
          role="alert"
          style={{
            marginBottom: 16,
            padding: "10px 12px",
            borderRadius: 12,
            background: "var(--color-error-bg)",
            border: "1px solid var(--color-error-border)",
            fontSize: 13,
            color: "var(--color-error-text)",
          }}
        >
          {state.groupsError}
        </div>
      )}
      {state.groupsLoading && !state.groups.length && (
        <p
          style={{
            margin: "0 0 16px",
            fontSize: 14,
            color: "var(--text-muted)",
          }}
        >
          Loading your groups…
        </p>
      )}
      <div
        className="eb-stagger"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: 16,
        }}
      >
        {groupViews.map((group) => (
          <div
            className="eb-lift"
            onClick={() => openGroupDetail(group.id)}
            style={{
              border: "1px solid var(--border-default)",
              borderRadius: 16,
              padding: 18,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
            key={group.id}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: "var(--text-heading)",
                }}
              >
                {group.name}
              </span>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  background: "var(--color-primary-50)",
                  color: "var(--color-primary-700)",
                  whiteSpace: "nowrap",
                }}
              >
                {group.planCount} plans
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {group.avatars.map((avatar, index) => (
                <span style={avatar.style} key={index}>
                  {avatar.initials}
                </span>
              ))}
              {group.hasOverflow && <span style={STACK_MORE_STYLE}>+{group.overflow}</span>}
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
              }}
            >
              <Button
                variant="outline"
                size="sm"
                className="eb-invert-hover"
                onClick={(event) => {
                  event.stopPropagation();
                  openCreateLunch(group.id);
                }}
                style={{
                  flex: 1,
                  width: "100%",
                  color: "var(--color-neutral-900)",
                  borderColor: "var(--color-neutral-900)",
                  background: "transparent",
                }}
              >
                + Plan a meal
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
