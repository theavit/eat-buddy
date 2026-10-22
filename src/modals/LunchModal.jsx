import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { toLunchView } from "../lib/viewModels";
import { useApp } from "../state/AppContext";
import { CLOSE_BUTTON_STYLE } from "../styles/shared";
import buddiesMark from "../assets/buddies-mark.png";

export function LunchModal() {
  const { state, closeModal, toggleJoin } = useApp();
  const position = state.lunches.findIndex((lunch) => lunch.id === state.modal.id);
  if (position < 0) {
    return null;
  }
  const view = toLunchView(state.lunches[position], position, state.groups);
  const handleClick = () => {
    toggleJoin(view.id);
    closeModal();
  };
  return (
    <Modal>
      <div
        style={{
          height: 150,
          background: "linear-gradient(120deg,#FDE9D4,#FBCB99)",
          borderRadius: "24px 24px 0 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <img
          src={buddiesMark}
          alt=""
          style={{
            height: 110,
            objectFit: "contain",
          }}
        />
        <button onClick={closeModal} aria-label="Close" style={CLOSE_BUTTON_STYLE}>
          ✕
        </button>
      </div>
      <div
        style={{
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 600,
              color: "var(--text-heading)",
            }}
          >
            {view.name}
          </h2>
          <span style={view.statusStyle}>{view.status}</span>
        </div>
        <p
          style={{
            margin: 0,
            color: "var(--text-body)",
          }}
        >
          {view.description}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            fontSize: 14,
          }}
        >
          <span>
            <strong
              style={{
                color: "var(--text-heading)",
              }}
            >
              Restaurant:
            </strong>{" "}
            {view.restaurant}
          </span>
          <span>
            <strong
              style={{
                color: "var(--text-heading)",
              }}
            >
              Meet at:
            </strong>{" "}
            {view.meta}
          </span>
          <span>
            <strong
              style={{
                color: "var(--text-heading)",
              }}
            >
              When:
            </strong>{" "}
            {view.dayTime}
          </span>
          <span>
            <strong
              style={{
                color: "var(--text-heading)",
              }}
            >
              Seats:
            </strong>{" "}
            {view.seats}
          </span>
        </div>
        <div>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-heading)",
            }}
          >
            Who's in
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            {view.avatars.map((avatar, index) => (
              <span style={avatar.style} key={index}>
                {avatar.initials}
              </span>
            ))}
          </div>
        </div>
        <a
          href={view.mapsUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: 14,
          }}
        >
          View on Google Maps
        </a>
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 6,
          }}
        >
          <Button variant="primary" onClick={handleClick}>
            {view.cta}
          </Button>
          <Button variant="outline" onClick={closeModal}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
