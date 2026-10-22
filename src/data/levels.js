const LEVELS = [
  {
    name: "Newbie",
    min: 0,
  },
  {
    name: "Food Explorer",
    min: 5,
  },
  {
    name: "Food Lover",
    min: 10,
  },
  {
    name: "Food Captain",
    min: 30,
  },
  {
    name: "Food Adventurer",
    min: 50,
  },
  {
    name: "King of Food",
    min: 51,
  },
];

export function levelFor(points) {
  let current = LEVELS[0];
  LEVELS.forEach((level) => {
    if (points >= level.min) {
      current = level;
    }
  });
  const next = LEVELS[LEVELS.indexOf(current) + 1];
  return {
    name: current.name,
    progressPct: next
      ? Math.min(100, Math.round(((points - current.min) / (next.min - current.min)) * 100))
      : 100,
    progressLabel: next ? `${points} / ${next.min} to ${next.name}` : "Max badge reached",
  };
}
