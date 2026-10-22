import { Button } from "../components/Button";
import { TextArea, TextInput } from "../components/Field";
import { Icon } from "../components/Icon";
import { Drawer, ModalHeader } from "../components/Modal";
import { MOMENT_RATINGS } from "../data/moments";
import { useApp } from "../state/AppContext";

export function AddMomentModal() {
  const { state, patch, setAddPlaceField, selectPlace, submitAddPlace } = useApp();
  const addPlaceForm = state.addPlaceForm;
  const query = (addPlaceForm.name || "").trim().toLowerCase();
  const matches = query
    ? state.restaurants
        .filter((restaurant) => restaurant.name.toLowerCase().includes(query))
        .slice(0, 5)
        .map((restaurant) => ({
          name: restaurant.name,
          address: `${restaurant.walk} from office`,
        }))
    : [];
  const showSuggestions = !!query && !state.manualAddressOpen;
  return (
    <Drawer>
      <div
        style={{
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <ModalHeader title="Add a moment" />
        <div
          style={{
            position: "relative",
          }}
        >
          <TextInput
            label="Place name"
            placeholder="Search a place..."
            value={addPlaceForm.name}
            onChange={(event) => {
              setAddPlaceField("name", event.target.value);
              patch({
                manualAddressOpen: false,
              });
            }}
          />
          {showSuggestions && (
            <div
              style={{
                position: "absolute",
                top: 66,
                left: 0,
                right: 0,
                background: "var(--color-neutral-0)",
                border: "1px solid var(--border-default)",
                borderRadius: 12,
                boxShadow: "var(--shadow-lg)",
                padding: 6,
                zIndex: 20,
                maxHeight: 220,
                overflowY: "auto",
              }}
            >
              {matches.map((match) => (
                <div
                  onClick={() => selectPlace(match.name)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 10px",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                  key={match.name}
                >
                  <Icon name="location_on" size={18} tone="primary" />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "var(--text-heading)",
                      }}
                    >
                      {match.name}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                      }}
                    >
                      {match.address}
                    </span>
                  </div>
                </div>
              ))}
              <div
                onClick={() =>
                  patch({
                    manualAddressOpen: true,
                  })
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 10px",
                  borderRadius: 8,
                  cursor: "pointer",
                  borderTop: "1px solid var(--border-default)",
                  marginTop: 4,
                }}
              >
                <Icon name="add_location_alt" size={18} tone="primary" />
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--color-primary-600)",
                  }}
                >
                  Can't find it? Add address manually
                </span>
              </div>
            </div>
          )}
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 11,
              color: "var(--text-muted)",
            }}
          >
            Search syncs with Google Maps places.
          </p>
        </div>
        {state.manualAddressOpen && (
          <TextInput
            label="Address"
            placeholder="Street, city"
            value={addPlaceForm.address || ""}
            onChange={(event) => setAddPlaceField("address", event.target.value)}
          />
        )}
        <TextArea
          label="Caption"
          value={addPlaceForm.description}
          onChange={(event) => setAddPlaceField("description", event.target.value)}
        />
        <div>
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--text-heading)",
            }}
          >
            Would you recommend it?
          </span>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 8,
            }}
          >
            {MOMENT_RATINGS.map((momentRating) => {
              const active = (addPlaceForm.recommend || "Love it!") === momentRating.v;
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                  }}
                  key={momentRating.v}
                >
                  <button
                    title={momentRating.v}
                    onClick={() => setAddPlaceField("recommend", momentRating.v)}
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      cursor: "pointer",
                      fontSize: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ...(active
                        ? {
                            background: "var(--color-primary-50)",
                            border: "2px solid var(--color-primary-500)",
                          }
                        : {
                            background: "var(--color-neutral-0)",
                            border: "1px solid var(--border-default)",
                          }),
                    }}
                  >
                    {momentRating.e}
                  </button>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "var(--text-muted)",
                    }}
                  >
                    {momentRating.v}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--text-heading)",
            }}
          >
            Photos
          </span>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 10,
              marginTop: 8,
            }}
          >
            {[0, 1, 2].map((slot) => (
              <div
                style={{
                  height: 90,
                  border: "2px dashed var(--border-default)",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  fontSize: 13,
                  cursor: "pointer",
                }}
                key={slot}
              >
                + Photo
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="primary"
          disabled={!addPlaceForm.name}
          onClick={submitAddPlace}
          style={{
            width: "100%",
          }}
        >
          Share moment
        </Button>
      </div>
    </Drawer>
  );
}
