import { Button } from "../components/Button";
import { LunchCard } from "../components/LunchCard";
import { toLunchView } from "../lib/viewModels";
import { useApp } from "../state/AppContext";
import { PANEL_STYLE } from "../styles/shared";

export function MealPlansScreen() {
  const { state, openCreateLunch } = useApp();
  const plans = state.lunches.map((lunch, index) => toLunchView(lunch, index, state.groups));
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
            Meal plans
          </h1>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 15,
              color: "var(--text-muted)",
            }}
          >
            Every meal plan across your groups.
          </p>
        </div>
        <Button variant="primary" onClick={() => openCreateLunch()}>
          + Plan a meal
        </Button>
      </div>
      <div
        className="eb-stagger"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
          gap: 16,
        }}
      >
        {plans.map((plan) => (
          <LunchCard lunch={plan} showGroupLabel={true} key={plan.id} />
        ))}
      </div>
    </section>
  );
}
