import { ACHIEVEMENTS } from "../data/achievements";
import { achievementProgress, toBadgeView } from "../lib/viewModels";
import { useApp } from "../state/AppContext";
import { CARD_STYLE } from "../styles/shared";
import { Icon } from "./Icon";

const RAIL_TITLE_STYLE = {
  margin: 0,
  fontSize: 17,
  fontWeight: 600,
  color: "var(--text-heading)",
};

const RAIL_LINK_STYLE = {
  fontSize: 13,
  fontWeight: 500,
};

function StatTile({ icon, value, label, bordered }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        ...(bordered
          ? {
              borderLeft: "1px solid var(--border-default)",
              borderRight: "1px solid var(--border-default)",
            }
          : null),
      }}
    >
      <Icon name={icon} size={26} tone="secondary" />
      <span
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "var(--text-heading)",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: 12,
          color: "var(--text-muted)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function ProgressRail() {
  const { state, go, openLunch } = useApp();
  const joined = state.lunches.filter((lunch) => lunch.joined);
  const progress = achievementProgress(ACHIEVEMENTS, state);
  const stats = {
    lunches: joined.length,
    restaurants: new Set(joined.map((lunch) => lunch.restaurant)).size,
    points: joined.length * 5 + new Set(joined.map((lunch) => lunch.restaurant)).size * 3,
    pct: progress.pct,
  };
  const badges = [...progress.list]
    .sort((first, second) => Number(second.earned) - Number(first.earned))
    .slice(0, 3)
    .map(toBadgeView);
  const upcoming = joined
    .filter((lunch) => !lunch.past)
    .slice(0, 3)
    .map((lunch) => ({
      id: lunch.id,
      name: lunch.name,
      when: lunch.dayTime || lunch.time,
    }));
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div style={CARD_STYLE}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <h3 style={RAIL_TITLE_STYLE}>Your Progress</h3>
          <span
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
            }}
          >
            This Month
          </span>
        </div>
        <div
          style={{
            border: "1px solid var(--border-default)",
            borderRadius: 16,
            padding: 16,
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
          }}
        >
          <StatTile icon="restaurant" value={stats.lunches} label="Meals" />
          <StatTile
            icon="storefront"
            value={stats.restaurants}
            label="Places Visited"
            bordered={true}
          />
          <StatTile icon="workspace_premium" value={stats.points} label="Points" />
        </div>
        <p
          style={{
            margin: "16px 0 8px",
            fontSize: 14,
            color: "var(--text-body)",
          }}
        >
          Keep exploring!
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 8,
              background: "var(--color-neutral-100)",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "var(--color-primary-500)",
                borderRadius: 999,
                width: `${stats.pct}%`,
              }}
            />
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--color-primary-500)",
            }}
          >
            {stats.pct}%
          </span>
        </div>
      </div>
      <div style={CARD_STYLE}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <h3 style={RAIL_TITLE_STYLE}>Achievements</h3>
          <a
            href="#achievements"
            onClick={(event) => {
              event.preventDefault();
              go("achievements");
            }}
            style={RAIL_LINK_STYLE}
          >
            View all
          </a>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 10,
          }}
        >
          {badges.map((badge) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
              key={badge.title}
            >
              <span style={badge.medalStyle}>
                <img src={badge.imgSrc} alt="" style={badge.imgStyle} />
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-heading)",
                  textAlign: "center",
                  lineHeight: 1.25,
                }}
              >
                {badge.title}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  textAlign: "center",
                  lineHeight: 1.3,
                }}
              >
                {badge.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div style={CARD_STYLE}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <h3 style={RAIL_TITLE_STYLE}>Upcoming Food Plans</h3>
          <a
            href="#groups"
            onClick={(event) => {
              event.preventDefault();
              go("groups");
            }}
            style={RAIL_LINK_STYLE}
          >
            View calendar
          </a>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {!upcoming.length && (
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "var(--text-muted)",
              }}
            >
              Nothing booked yet — join a plan and it shows up here.
            </p>
          )}
          {upcoming.map((plan) => (
            <div
              onClick={() => openLunch(plan.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 10,
                borderRadius: 12,
                cursor: "pointer",
                background: "var(--color-primary-50)",
              }}
              key={plan.id}
            >
              <Icon name="calendar_month" size={22} tone="primary" />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text-heading)",
                  }}
                >
                  {plan.name}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                  }}
                >
                  {plan.when}
                </span>
              </div>
              <span
                style={{
                  color: "var(--color-primary-500)",
                  fontWeight: 600,
                }}
              >
                →
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
