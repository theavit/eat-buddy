import { useIsMobile } from "../../hooks/useMediaQuery";
import { useApp } from "../../state/AppContext";
import { INPUT_STYLE, PRIMARY_BUTTON_STYLE } from "../../styles/shared";
import noBuddy from "../../assets/no-buddy.png";
import yesBuddy from "../../assets/yes-buddy.png";

// A mascot holding up one answer. Once the coin lands, the matching one steps forward
// and the other fades back.
function AnswerBuddy({ answer, src, height, landed, result, maxWidth }) {
  const won = landed && result === answer;
  const lost = landed && result !== answer;
  return (
    <div
      style={{
        justifySelf: "center",
        width: "100%",
        maxWidth,
        transform: won ? "scale(1.1)" : lost ? "scale(.9)" : "none",
        opacity: lost ? 0.35 : 1,
        filter: lost ? "grayscale(.7)" : "none",
        transition: "transform .35s ease, opacity .35s ease, filter .35s ease",
      }}
    >
      <img
        src={src}
        alt={`An Eat Buddy mascot holding up a ${answer} sign`}
        width={520}
        height={height}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          animation: "eb-float 5s ease-in-out infinite",
        }}
      />
    </div>
  );
}

export function CoinFlip() {
  const { state, patch, flipYesNo } = useApp();
  const isMobile = useIsMobile();
  const { yesNoQuestion, yesNoSpinning, yesNoResult } = state;
  const question = (yesNoQuestion || "").trim();
  const landed = !!yesNoResult && !yesNoSpinning;
  const isYes = yesNoResult === "Yes";
  const coinFace = landed
    ? isYes
      ? "var(--color-success-500)"
      : "var(--color-error-500)"
    : "var(--color-primary-500)";
  const buddyProps = {
    landed,
    result: yesNoResult,
    maxWidth: isMobile ? 140 : 260,
  };
  const noBuddyView = <AnswerBuddy answer="No" src={noBuddy} height={530} {...buddyProps} />;
  const yesBuddyView = <AnswerBuddy answer="Yes" src={yesBuddy} height={526} {...buddyProps} />;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr minmax(0, 420px) 1fr",
        alignItems: "center",
        gap: 24,
        padding: "20px 0",
      }}
    >
      {!isMobile && noBuddyView}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            maxWidth: 420,
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--text-heading)",
            }}
          >
            Can't decide? Let the coin choose.
          </h3>
          <p
            style={{
              marginTop: 6,
              fontSize: 14,
              lineHeight: "20px",
              color: "var(--text-muted)",
            }}
          >
            Type a yes/no question, press Flip, and the coin lands on{" "}
            <strong
              style={{
                color: "var(--color-success-text)",
              }}
            >
              Yes
            </strong>{" "}
            or{" "}
            <strong
              style={{
                color: "var(--color-error-text)",
              }}
            >
              No
            </strong>{" "}
            — a straight 50/50, exactly like tossing a real coin.
          </p>
        </div>
        <input
          type="text"
          placeholder="e.g. Should we get ramen today?"
          value={yesNoQuestion}
          onChange={(event) =>
            patch({
              yesNoQuestion: event.target.value,
            })
          }
          style={{
            ...INPUT_STYLE,
            maxWidth: 360,
          }}
        />
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: `radial-gradient(circle at 34% 28%, rgba(255,255,255,.4), rgba(255,255,255,0) 58%), ${coinFace}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "6px solid var(--color-neutral-0)",
            boxShadow: "var(--shadow-lg), inset 0 -6px 14px rgba(0,0,0,.18)",
            transition: "background .3s ease",
            ...(yesNoSpinning
              ? {
                  animation: "eb-coin-flip .5s ease-in-out infinite",
                }
              : null),
          }}
        >
          <span
            style={{
              fontSize: landed ? 34 : 30,
              fontWeight: 700,
              letterSpacing: landed ? 1 : 0,
              color: "var(--text-on-primary)",
            }}
          >
            {landed ? yesNoResult.toUpperCase() : "?"}
          </span>
        </div>
        <span
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          {yesNoSpinning ? "Tossing the coin…" : "Every flip is an independent 50/50."}
        </span>
        <button
          onClick={flipYesNo}
          disabled={yesNoSpinning}
          style={{
            ...PRIMARY_BUTTON_STYLE,
            maxWidth: 360,
            border: "none",
            cursor: "pointer",
          }}
        >
          {yesNoSpinning ? "Flipping…" : yesNoResult ? "Flip again" : "Flip"}
        </button>
        {landed && (
          <div
            style={{
              maxWidth: 360,
              width: "100%",
              padding: "12px 18px",
              borderRadius: 14,
              textAlign: "center",
              background: isYes ? "var(--color-success-bg)" : "var(--color-error-bg)",
              border: `1px solid ${isYes ? "var(--color-success-border)" : "var(--color-error-border)"}`,
            }}
          >
            {question && (
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-body)",
                }}
              >
                “{question}”
              </p>
            )}
            <p
              style={{
                marginTop: question ? 4 : 0,
                fontSize: 18,
                fontWeight: 700,
                color: isYes ? "var(--color-success-text)" : "var(--color-error-text)",
              }}
            >
              The coin says {yesNoResult}
            </p>
          </div>
        )}
        {isMobile && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              width: "100%",
            }}
          >
            {noBuddyView}
            {yesBuddyView}
          </div>
        )}
      </div>
      {!isMobile && yesBuddyView}
    </div>
  );
}
