import { WOULD_YOU_RATHER } from "../../data/games";
import { useApp } from "../../state/AppContext";

export function WouldYouRather() {
  const { state, pickWyr, nextWyr } = useApp();
  const question = WOULD_YOU_RATHER[state.wyrIndex % WOULD_YOU_RATHER.length];
  const wyrChoice = state.wyrChoice;
  const optionStyle = (side) => ({
    padding: "22px 18px",
    borderRadius: 16,
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "var(--font-family-base)",
    cursor: "pointer",
    textAlign: "center",
    transition: "background-color .15s ease, border-color .15s ease, color .15s ease",
    ...(wyrChoice
      ? wyrChoice === side
        ? {
            background: "var(--color-primary-500)",
            border: "1px solid var(--color-primary-500)",
            color: "var(--text-on-primary)",
          }
        : {
            background: "var(--color-neutral-100)",
            border: "1px solid var(--border-default)",
            color: "var(--text-muted)",
          }
      : {
          background: "var(--color-neutral-0)",
          border: "1px solid var(--border-default)",
          color: "var(--text-heading)",
        }),
  });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        maxWidth: 640,
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: ".04em",
        }}
      >
        Would you rather…
      </span>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gap: 16,
          alignItems: "center",
          width: "100%",
        }}
      >
        <button onClick={() => pickWyr("a")} style={optionStyle("a")}>
          {question.a}
        </button>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--text-muted)",
          }}
        >
          OR
        </span>
        <button onClick={() => pickWyr("b")} style={optionStyle("b")}>
          {question.b}
        </button>
      </div>
      {wyrChoice && (
        <button
          onClick={nextWyr}
          style={{
            marginTop: 4,
            padding: "10px 22px",
            borderRadius: 999,
            border: "none",
            background: "var(--color-primary-500)",
            color: "var(--text-on-primary)",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "var(--font-family-base)",
          }}
        >
          Next question
        </button>
      )}
    </div>
  );
}
