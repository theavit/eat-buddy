import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { MOMENTS, MOMENT_CATEGORIES } from "../data/moments";
import { useApp } from "../state/AppContext";
import { CARD_GRADIENTS, RATING_TAG_STYLES } from "../styles/shared";

function chipStyle(active, { activeBg = "var(--color-primary-500)", activeColor = "#fff" } = {}) {
  return {
    padding: "8px 18px",
    borderRadius: 999,
    cursor: "pointer",
    fontFamily: "var(--font-family-base)",
    fontSize: 14,
    fontWeight: 500,
    transition: "all .15s ease",
    ...(active
      ? {
          background: activeBg,
          color: activeColor,
          border: `1px solid ${activeBg}`,
        }
      : {
          background: "var(--color-neutral-0)",
          color: "var(--color-neutral-700)",
          border: "1px solid var(--border-default)",
        }),
  };
}

export function MomentsScreen() {
  const {
    state,
    patch,
    openAddPlace,
    openMomentModal,
    onMomentPhotoChange,
    registerFileInput,
    triggerPhotoPicker,
  } = useApp();
  const overrides = state.photoOverrides || {};
  return (
    <section>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
              color: "var(--text-heading)",
            }}
          >
            Moments ✨
          </h1>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 15,
              color: "var(--text-muted)",
            }}
          >
            See what your team is eating and loving.
          </p>
        </div>
        <Button variant="primary" onClick={openAddPlace}>
          + Add moment
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        {MOMENT_CATEGORIES.map((momentCategory) => (
          <button
            onClick={() =>
              patch({
                category: momentCategory,
              })
            }
            style={chipStyle(state.category === momentCategory)}
            key={momentCategory}
          >
            {momentCategory}
          </button>
        ))}
        <button
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            borderRadius: 999,
            border: "1px solid var(--border-default)",
            background: "var(--color-neutral-0)",
            cursor: "pointer",
            fontSize: 14,
            color: "var(--text-heading)",
            fontFamily: "var(--font-family-base)",
          }}
        >
          <Icon name="tune" size={16} tone="secondary" />
          Filters
        </button>
      </div>
      <div
        className="eb-stagger"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 18,
          alignItems: "stretch",
        }}
      >
        {MOMENTS.map((moment, index) => {
          const override = overrides[index];
          return (
            <div
              onClick={() => openMomentModal(index)}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                background: "var(--color-neutral-0)",
                border: "1px solid var(--border-default)",
                borderRadius: 16,
                overflow: "hidden",
                cursor: "pointer",
              }}
              key={`${moment.user}-${index}`}
            >
              <div
                style={{
                  height: 200,
                  flexShrink: 0,
                  position: "relative",
                  background: CARD_GRADIENTS[index % CARD_GRADIENTS.length],
                  ...(override || moment.photo
                    ? {
                        backgroundImage: `url("${override || moment.photo}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : null),
                }}
              >
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    triggerPhotoPicker(index);
                  }}
                  aria-label={`Replace photo for ${moment.dish}`}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(0,0,0,.55)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 5,
                  }}
                >
                  <Icon name="photo_camera" size={16} tone="inverse" />
                </button>
                <input
                  type="file"
                  ref={(input) => registerFileInput(index, input)}
                  accept="image/*"
                  onChange={(event) => onMomentPhotoChange(index, event)}
                  style={{
                    display: "none",
                  }}
                />
              </div>
              <div
                style={{
                  flex: 1,
                  padding: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text-heading)",
                    }}
                  >
                    <Icon name="location_on" size={15} tone="muted" />
                    {moment.restaurant}
                  </span>
                  <span style={RATING_TAG_STYLES[moment.tag]}>{moment.tag}</span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "var(--text-body)",
                  }}
                >
                  {moment.caption}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginTop: "auto",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 13,
                      color: "var(--color-primary-500)",
                      fontWeight: 600,
                    }}
                  >
                    <Icon name="favorite" size={16} tone="primary" />
                    {moment.likes}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 13,
                      color: "var(--text-muted)",
                    }}
                  >
                    <Icon name="chat_bubble" size={16} tone="muted" />
                    {moment.comments}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
