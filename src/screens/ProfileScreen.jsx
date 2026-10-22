import { Button } from "../components/Button";
import { ACHIEVEMENTS } from "../data/achievements";
import { levelFor } from "../data/levels";
import { achievementProgress, toBadgeView } from "../lib/viewModels";
import { useApp } from "../state/AppContext";
import { BadgeCard } from "./AchievementsScreen";

const LEVEL_SHORT_NAMES = ["Newbie", "Explorer", "Lover", "Captain", "Adventurer", "King"];

function ProfileStat({ value, label }) {
  return (
    <div
      style={{
        background: "var(--color-primary-50)",
        borderRadius: 16,
        padding: 22,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "var(--text-heading)",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "var(--text-muted)",
        }}
      >
        {label}
      </div>
    </div>
  );
}

export function ProfileScreen() {
  const { state, go, openSettings } = useApp();
  const user = state.user;
  const joined = state.lunches.filter((lunch) => lunch.joined);
  const level = levelFor(12);
  const stats = {
    created: 2,
    joined: joined.length + 4,
    total: 12,
    badge: level.name,
    progressPct: level.progressPct,
    progressLabel: level.progressLabel,
  };
  const badges = achievementProgress(ACHIEVEMENTS, state).list.slice(0, 6).map(toBadgeView);
  return (
    <section
      style={{
        background: "var(--color-neutral-0)",
        border: "1px solid var(--border-default)",
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 18,
            }}
          >
            <span
              style={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                background: state.vibeColor,
                color: "#fff",
                fontSize: 36,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "5px solid var(--color-neutral-0)",
              }}
            >
              {user.initials}
            </span>
            <div
              style={{
                paddingBottom: 10,
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: 28,
                  fontWeight: 600,
                  color: "var(--text-heading)",
                }}
              >
                {user.name}
              </h1>
              <span
                style={{
                  fontSize: 15,
                  color: "var(--text-muted)",
                }}
              >
                {user.dept} · {stats.badge}
              </span>
            </div>
          </div>
          <Button variant="outline" onClick={openSettings}>
            Edit profile
          </Button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 16,
            marginTop: 28,
          }}
        >
          <ProfileStat value={stats.created} label="Created places" />
          <ProfileStat value={stats.joined} label="Joined places" />
          <ProfileStat value={stats.total} label="Total actions" />
        </div>
        <div
          style={{
            marginTop: 32,
            border: "1px solid var(--border-default)",
            borderRadius: 16,
            padding: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 15,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontWeight: 600,
                color: "var(--text-heading)",
              }}
            >
              {stats.badge}
            </span>
            <span
              style={{
                color: "var(--text-muted)",
              }}
            >
              {stats.progressLabel}
            </span>
          </div>
          <div
            style={{
              height: 12,
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
                width: `${stats.progressPct}%`,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: "var(--text-muted)",
              marginTop: 8,
            }}
          >
            {LEVEL_SHORT_NAMES.map((levelShortName) => (
              <span key={levelShortName}>{levelShortName}</span>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "32px 0 16px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 600,
              color: "var(--text-heading)",
            }}
          >
            Your badges
          </h2>
          <a
            href="#achievements"
            onClick={(event) => {
              event.preventDefault();
              go("achievements");
            }}
            style={{
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            View all
          </a>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 16,
          }}
        >
          {badges.map((badge) => (
            <BadgeCard badge={badge} key={badge.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
