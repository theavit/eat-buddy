import { RESTAURANT_PHOTOS } from "../data/restaurants";
import { CARD_GRADIENTS, stackAvatarStyle } from "../styles/shared";
import { initialsOf } from "./format";
import buddiesMark from "../assets/buddies-mark.png";

const statusPillStyle = (background, color) => ({
  padding: "4px 12px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  background,
  color,
});

const STATUS_PILLS = {
  Open: statusPillStyle("var(--color-success-bg,#E8F3E3)", "#4C7A2E"),
  Voting: statusPillStyle("var(--color-primary-50)", "var(--color-primary-700)"),
  Full: statusPillStyle("var(--color-neutral-100)", "var(--text-muted)"),
  Completed: statusPillStyle("var(--color-neutral-100)", "var(--text-muted)"),
};

function photoBackground(photo, index) {
  if (photo) {
    return {
      backgroundImage: `url("${photo}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  } else {
    return {
      background: CARD_GRADIENTS[index % CARD_GRADIENTS.length],
    };
  }
}

export function toLunchView(lunch, cardIndex, groups) {
  const group = lunch.groupId ? groups.find((candidate) => candidate.id === lunch.groupId) : null;
  const overflow = lunch.participants.length - 3;
  const status = !lunch.past && lunch.participants.length >= lunch.capacity ? "Full" : lunch.status;
  return {
    ...lunch,
    status,
    statusStyle: STATUS_PILLS[status] || STATUS_PILLS.Open,
    thumbStyle: {
      width: 74,
      height: 74,
      borderRadius: 14,
      flexShrink: 0,
      ...photoBackground(RESTAURANT_PHOTOS[lunch.restaurant], cardIndex),
    },
    avatars: lunch.participants.slice(0, 3).map((participant, index) => ({
      initials: initialsOf(participant),
      style: stackAvatarStyle(index),
    })),
    hasOverflow: overflow > 0,
    overflow,
    seats: `${lunch.participants.length} / ${lunch.capacity}`,
    cta: lunch.past ? "View" : lunch.joined ? "Leave" : lunch.voting ? "Vote" : "Join",
    ctaVariant: lunch.past || lunch.joined || lunch.voting ? "outline" : "primary",
    hasTimer: !!lunch.timerLabel,
    mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(lunch.restaurant)}`,
    groupLabel: group ? group.name : "No group",
  };
}

export function toRestaurantView(restaurant, index) {
  return {
    ...restaurant,
    cuisineLine: `${restaurant.cuisine} · ${restaurant.price}`,
    thumbStyle: {
      width: 76,
      height: 76,
      borderRadius: 14,
      flexShrink: 0,
      ...photoBackground(restaurant.photo, index),
    },
    bannerStyle: {
      height: 120,
      position: "relative",
      borderRadius: "24px 24px 0 0",
      ...photoBackground(restaurant.photo, index),
    },
  };
}

export function toBadgeView(badge) {
  const hasImage = !!badge.badgeImg;
  return {
    ...badge,
    imgSrc: badge.badgeImg || buddiesMark,
    medalStyle: {
      width: 74,
      height: 74,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...(hasImage
        ? {
            overflow: "hidden",
          }
        : {
            background: badge.earned
              ? "linear-gradient(135deg,#FDE2C8,#F7AB73)"
              : "var(--color-neutral-100)",
          }),
    },
    imgStyle: {
      ...(hasImage
        ? {
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }
        : {
            width: 66,
            height: 66,
            objectFit: "contain",
          }),
      ...(badge.earned
        ? null
        : {
            filter: "grayscale(1)",
            opacity: 0.45,
          }),
    },
    cardStyle: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      padding: 18,
      border: "1px solid var(--border-default)",
      borderRadius: 16,
      background: badge.earned ? "var(--color-neutral-0)" : "#FFFBF7",
    },
    tag: badge.earned ? "Unlocked" : "Locked",
    tagStyle: {
      padding: "3px 10px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 600,
      ...(badge.earned
        ? {
            background: "var(--color-primary-50)",
            color: "var(--color-primary-700)",
          }
        : {
            background: "var(--color-neutral-100)",
            color: "var(--text-muted)",
          }),
    },
  };
}

export function toGroupViews(groups, lunches) {
  return groups.map((group) => {
    const overflow = group.members.length - 4;
    return {
      ...group,
      memberCount: group.members.length,
      avatars: group.members.slice(0, 4).map((member, index) => ({
        initials: initialsOf(member),
        style: stackAvatarStyle(index),
      })),
      overflow,
      hasOverflow: overflow > 0,
      planCount: lunches.filter((lunch) => lunch.groupId === group.id).length,
    };
  });
}

export function achievementProgress(achievements, state) {
  const joined = state.lunches.filter((lunch) => lunch.joined);
  const stats = {
    joined,
    places: new Set(joined.map((lunch) => lunch.restaurant)).size,
    created: state.lunches.filter((lunch) => lunch.participants[0] === state.user.name).length,
    groups: state.groups.length,
  };
  const list = achievements.map((achievement) => ({
    ...achievement,
    earned: typeof achievement.test == "function" ? !!achievement.test(stats) : false,
  }));
  const earned = list.filter((achievement) => achievement.earned).length;
  return {
    list,
    earned,
    total: list.length,
    pct: list.length ? Math.round((earned / list.length) * 100) : 0,
  };
}
