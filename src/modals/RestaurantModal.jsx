import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { toRestaurantView } from "../lib/viewModels";
import { useApp } from "../state/AppContext";
import { CLOSE_BUTTON_STYLE } from "../styles/shared";

export function RestaurantModal() {
  const { state, closeModal, openCreateLunch } = useApp();
  const index = state.restaurants.findIndex((restaurant) => restaurant.id === state.modal.id);
  if (index < 0) {
    return null;
  }
  const view = toRestaurantView(state.restaurants[index], index);
  return (
    <Modal maxWidth={460}>
      <div style={view.bannerStyle}>
        <button onClick={closeModal} aria-label="Close" style={CLOSE_BUTTON_STYLE}>
          ✕
        </button>
      </div>
      <div
        style={{
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 600,
            color: "var(--text-heading)",
          }}
        >
          {view.name}
        </h2>
        <div
          style={{
            display: "flex",
            gap: 14,
            fontSize: 14,
            color: "var(--text-muted)",
          }}
        >
          <span
            style={{
              fontWeight: 600,
              color: "var(--color-primary-500)",
            }}
          >
            ★ {view.rating}
          </span>
          <span>{view.cuisineLine}</span>
          <span>{view.walk}</span>
        </div>
        <p
          style={{
            margin: 0,
            color: "var(--text-body)",
          }}
        >
          {view.description}
        </p>
        <Button
          variant="primary"
          onClick={() => openCreateLunch()}
          style={{
            width: "100%",
          }}
        >
          Create a lunch here
        </Button>
      </div>
    </Modal>
  );
}
