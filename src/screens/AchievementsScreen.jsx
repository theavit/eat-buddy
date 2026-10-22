import { ACHIEVEMENTS } from "../data/achievements";
import { achievementProgress, toBadgeView } from "../lib/viewModels";
import { useApp } from "../state/AppContext";
import { PANEL_STYLE } from "../styles/shared";

export function BadgeCard({ badge }) {
  return (
    <div style={badge.cardStyle}>
      <span style={badge.medalStyle}>
        <img src={badge.imgSrc} alt="" style={badge.imgStyle} />
      </span>
      <span
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: "var(--text-heading)",
          textAlign: "center",
        }}
      >
        {badge.title}
      </span>
      <span
        style={{
          fontSize: 12,
          color: "var(--text-muted)",
          textAlign: "center",
        }}
      >
        {badge.desc}
      </span>
      <span style={badge.tagStyle}>{badge.tag}</span>
    </div>
  );
}

export function AchievementsScreen() {
  const { state } = useApp();
  const badges = achievementProgress(ACHIEVEMENTS, state).list.map(toBadgeView);
  return (
    <section style={PANEL_STYLE}>
      <h1
        style={{
          margin: 0,
          fontSize: 26,
          fontWeight: 600,
          color: "var(--text-heading)",
        }}
      >
        Achievements
      </h1>
      <p
        style={{
          margin: "4px 0 24px",
          fontSize: 15,
          color: "var(--text-muted)",
        }}
      >
        Every lunch counts. Here's what you've unlocked.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
          gap: 18,
        }}
      >
        {badges.map((badge) => (
          <BadgeCard badge={badge} key={badge.title} />
        ))}
      </div>
    </section>
  );
}
