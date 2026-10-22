import { Icon } from "../../components/Icon";
import { useApp } from "../../state/AppContext";
import { INPUT_STYLE, LABEL_STYLE, PRIMARY_BUTTON_STYLE } from "../../styles/shared";
import { EMPTY_HINT_STYLE, ROUND_BUTTON_STYLE } from "./gameStyles";

const WHEEL_COLORS = [
  "var(--color-primary-500)",
  "var(--color-warning-500)",
  "var(--color-success-500)",
  "var(--color-info-500)",
  "var(--color-primary-300)",
  "var(--color-error-500)",
  "var(--color-primary-700)",
  "var(--color-neutral-500)",
];

export function SpinWheel() {
  const { state, patch, addFood, removeFood, spinWheel } = useApp();
  const { gameFoods, spinning, spinResult, wheelRotation, newFoodInput } = state;
  const tooFew = gameFoods.length < 2;
  const canSpin = gameFoods.length >= 2 && !spinning;
  const wheelBackground = `conic-gradient(${gameFoods
    .map((gameFood, index) => {
      const count = gameFoods.length;
      const start = ((100 / count) * index).toFixed(2);
      const end = ((100 / count) * (index + 1)).toFixed(2);
      return `${WHEEL_COLORS[index % WHEEL_COLORS.length]} ${start}% ${end}%`;
    })
    .join(", ")})`;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
        gap: 32,
        alignItems: "start",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <label style={LABEL_STYLE}>Add a food option</label>
        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          <input
            type="text"
            placeholder="e.g. Ramen"
            value={newFoodInput}
            onChange={(event) =>
              patch({
                newFoodInput: event.target.value,
              })
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addFood();
              }
            }}
            style={{
              ...INPUT_STYLE,
              flex: 1,
            }}
          />
          <button onClick={addFood} aria-label="Add food option" style={ROUND_BUTTON_STYLE}>
            <Icon name="add" size={20} tone="#ffffff" />
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {gameFoods.map((gameFood, index) => (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 10px",
                borderRadius: 999,
                background: "var(--color-neutral-100)",
                fontSize: 13,
                color: "var(--text-heading)",
              }}
              key={`${gameFood}-${index}`}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: WHEEL_COLORS[index % WHEEL_COLORS.length],
                  display: "inline-block",
                }}
              />
              {gameFood}
              <span
                onClick={() => removeFood(index)}
                style={{
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                ✕
              </span>
            </span>
          ))}
        </div>
        {tooFew && <span style={EMPTY_HINT_STYLE}>Add at least 2 options to spin.</span>}
        <button
          onClick={spinWheel}
          disabled={!canSpin}
          style={{
            ...PRIMARY_BUTTON_STYLE,
            marginTop: 8,
            border: "none",
            cursor: canSpin ? "pointer" : "not-allowed",
            opacity: canSpin ? 1 : 0.45,
          }}
        >
          {spinning ? "Spinning…" : "Spin the wheel"}
        </button>
        {spinResult && !spinning && (
          <div
            style={{
              marginTop: 6,
              padding: 14,
              borderRadius: 14,
              background: "var(--color-primary-50)",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: "var(--color-primary-700)",
                fontWeight: 600,
              }}
            >
              Tonight's pick
            </span>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 20,
                fontWeight: 700,
                color: "var(--text-heading)",
              }}
            >
              {spinResult}
            </p>
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 340,
            aspectRatio: "1 / 1",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "-14%",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(242,106,33,.38) 0%, rgba(242,106,33,.16) 45%, rgba(242,106,33,0) 70%)",
              opacity: spinning ? 1 : 0.6,
              transition: "opacity .4s ease",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "5%",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -10,
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "12px solid transparent",
                borderRight: "12px solid transparent",
                borderTop: "20px solid var(--color-neutral-900)",
                filter: "drop-shadow(0 1px 2px rgba(255,255,255,.9))",
                zIndex: 3,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                transform: `rotate(${wheelRotation}deg)`,
                transition: spinning ? "transform 3.2s cubic-bezier(.17,.67,.16,1)" : "none",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  border: "6px solid var(--color-neutral-0)",
                  boxShadow: "var(--shadow-lg)",
                  background: wheelBackground,
                }}
              />
              <svg
                viewBox="0 0 280 280"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                }}
              >
                {gameFoods.map((gameFood, index) => {
                  const angle = (360 / gameFoods.length) * (index + 0.5);
                  const fontSize = gameFood.length > 12 ? Math.max(9, 156 / gameFood.length) : 13;
                  return (
                    <text
                      x={258}
                      y={140}
                      transform={`rotate(${angle - 90} 140 140)`}
                      textAnchor="end"
                      dominantBaseline="middle"
                      fill="#ffffff"
                      stroke="rgba(0,0,0,.45)"
                      strokeWidth={2.5}
                      paintOrder="stroke"
                      style={{
                        fontFamily: "var(--font-family-base)",
                        fontSize,
                        fontWeight: 700,
                        letterSpacing: 0.2,
                      }}
                      key={`${gameFood}-${index}`}
                    >
                      {gameFood}
                    </text>
                  );
                })}
              </svg>
            </div>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 26,
                height: 26,
                transform: "translate(-50%,-50%)",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 34% 30%, #fff7dd 0%, #f0c05a 45%, #b57a15 100%)",
                border: "2px solid rgba(255,255,255,.85)",
                boxShadow: "0 2px 6px rgba(0,0,0,.35)",
                zIndex: 2,
              }}
            />
          </div>
        </div>
        {tooFew && (
          <span
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
            }}
          >
            Add food options on the left to build your wheel.
          </span>
        )}
      </div>
    </div>
  );
}
