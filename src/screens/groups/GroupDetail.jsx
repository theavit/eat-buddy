import { Button } from "../../components/Button";
import { Icon } from "../../components/Icon";
import { LunchCard } from "../../components/LunchCard";
import { toLunchView } from "../../lib/viewModels";
import { useApp } from "../../state/AppContext";
import { PANEL_STYLE } from "../../styles/shared";
import emptyPlans from "../../assets/empty-plans.png";

export function GroupDetail() {
  const { state, patch, backToGroups, openCreateLunch } = useApp();
  const selectedGroup = state.groups.find((group) => group.id === state.selectedGroupId);
  if (!selectedGroup) {
    return null;
  }
  const groupPlans = state.lunches
    .map((lunch, index) => toLunchView(lunch, index, state.groups))
    .filter((plan) => plan.groupId === selectedGroup.id);
  const showPast = state.groupPlanFilter === "past";
  const visiblePlans = groupPlans.filter((plan) => (showPast ? !!plan.past : !plan.past));
  const filters = [
    {
      v: "upcoming",
      label: "Upcoming",
    },
    {
      v: "past",
      label: "Past",
    },
  ];
  return (
    <section style={PANEL_STYLE}>
      <a
        href="#groups"
        onClick={(event) => {
          event.preventDefault();
          backToGroups();
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 14,
          fontWeight: 500,
          marginBottom: 16,
        }}
      >
        <Icon name="arrow_back" size={18} tone="primary" />
        All groups
      </a>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
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
            {selectedGroup.name}
          </h1>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 15,
              color: "var(--text-muted)",
            }}
          >
            {selectedGroup.members.length} members
          </p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 600,
            color: "var(--text-heading)",
          }}
        >
          Meal plans
        </h2>
        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          {filters.map((filter) => {
            const active = (state.groupPlanFilter || "upcoming") === filter.v;
            return (
              <button
                onClick={() =>
                  patch({
                    groupPlanFilter: filter.v,
                  })
                }
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "var(--font-family-base)",
                  ...(active
                    ? {
                        background: "var(--color-neutral-300)",
                        color: "var(--text-heading)",
                        border: "1px solid var(--color-neutral-300)",
                      }
                    : {
                        background: "var(--color-neutral-0)",
                        color: "var(--text-body)",
                        border: "1px solid var(--border-default)",
                      }),
                }}
                key={filter.v}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
      <div
        className="eb-stagger"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: 16,
        }}
      >
        {visiblePlans.map((plan) => (
          <LunchCard lunch={plan} key={plan.id} />
        ))}
      </div>
      {visiblePlans.length === 0 && (
        <div
          style={{
            borderRadius: 20,
            background: "#FFF8F0",
            padding: "20px 20px 40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 6,
          }}
        >
          <img
            src={emptyPlans}
            alt=""
            style={{
              width: "100%",
              maxWidth: 380,
              objectFit: "contain",
            }}
          />
          <h2
            style={{
              margin: "4px 0 0",
              fontSize: 24,
              fontWeight: 700,
              color: "var(--text-heading)",
            }}
          >
            {showPast ? "No past meal plans" : "No meal plans yet!"}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: "var(--text-muted)",
              maxWidth: 320,
            }}
          >
            {showPast
              ? "This group hasn't completed any meal plans yet."
              : "You haven't created any meal plans. Let's plan something delicious!"}
          </p>
          <div
            style={{
              marginTop: 14,
            }}
          >
            <Button variant="primary" onClick={() => openCreateLunch(selectedGroup.id)}>
              + Create a Plan
            </Button>
          </div>
          <a
            href="#groups"
            onClick={(event) => {
              event.preventDefault();
              backToGroups();
            }}
            style={{
              marginTop: 16,
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Icon name="group" size={18} tone="primary" />
            Explore with Buddies
          </a>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: 12,
              color: "var(--text-muted)",
            }}
          >
            Get inspired by what your team is planning.
          </p>
        </div>
      )}
    </section>
  );
}
