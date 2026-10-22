import { useApp } from "../state/AppContext";
import { STACK_MORE_STYLE } from "../styles/shared";
import { Button } from "./Button";
import { Icon } from "./Icon";

const TODAY_CARD_STYLE = {
  border: "1px solid var(--border-default)",
  borderRadius: 16,
  padding: 16,
  cursor: "pointer",
  background: "var(--color-neutral-0)",
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

function AvatarStack({ lunch, showOverflow }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {lunch.avatars.map((avatar, index) => (
        <span style={avatar.style} key={index}>
          {avatar.initials}
        </span>
      ))}
      {showOverflow && lunch.hasOverflow && <span style={STACK_MORE_STYLE}>+{lunch.overflow}</span>}
    </div>
  );
}

function LunchAction({ lunch }) {
  const { openLunch, toggleJoin } = useApp();
  const handleClick = () =>
    lunch.past || (lunch.voting && !lunch.joined) ? openLunch(lunch.id) : toggleJoin(lunch.id);
  return (
    <div onClick={(event) => event.stopPropagation()}>
      <Button variant={lunch.ctaVariant} size="sm" onClick={handleClick}>
        {lunch.cta}
      </Button>
    </div>
  );
}

export function LunchCard({ lunch, variant = "compact", showGroupLabel = false }) {
  const { openLunch } = useApp();
  if (variant === "today") {
    return (
      <div className="eb-lift" onClick={() => openLunch(lunch.id)} style={TODAY_CARD_STYLE}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--color-primary-500)",
            }}
          >
            {lunch.time}
          </span>
          <span style={lunch.statusStyle}>{lunch.status}</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              minWidth: 0,
            }}
          >
            <span
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: "var(--text-heading)",
              }}
            >
              {lunch.name}
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "var(--text-muted)",
              }}
            >
              <Icon name={lunch.metaIcon} size={16} tone="muted" />
              {lunch.meta}
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "var(--text-muted)",
              }}
            >
              <Icon name="storefront" size={16} tone="muted" />
              {lunch.restaurant}
            </span>
          </div>
          <span style={lunch.thumbStyle} />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            marginTop: 2,
          }}
        >
          <AvatarStack lunch={lunch} showOverflow={true} />
          <span
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              whiteSpace: "nowrap",
            }}
          >
            {lunch.seats}
          </span>
          <LunchAction lunch={lunch} />
        </div>
        {lunch.hasTimer && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "var(--color-primary-600)",
              fontWeight: 500,
            }}
          >
            <Icon name="schedule" size={14} tone="primary" />
            {lunch.timerLabel}
          </span>
        )}
      </div>
    );
  } else {
    return (
      <div className="eb-lift" onClick={() => openLunch(lunch.id)} style={TODAY_CARD_STYLE}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--color-primary-500)",
            }}
          >
            {lunch.dayTime}
          </span>
          <span style={lunch.statusStyle}>{lunch.status}</span>
        </div>
        <span
          style={{
            fontSize: 17,
            fontWeight: 600,
            color: "var(--text-heading)",
          }}
        >
          {lunch.name}
        </span>
        <span
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
          }}
        >
          {lunch.restaurant} · {lunch.meta}
        </span>
        {showGroupLabel && (
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--color-primary-600)",
            }}
          >
            {lunch.groupLabel}
          </span>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <AvatarStack lunch={lunch} />
          <span
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
            }}
          >
            {lunch.seats}
          </span>
          <LunchAction lunch={lunch} />
        </div>
      </div>
    );
  }
}
