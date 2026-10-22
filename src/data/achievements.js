import badgeCoffee from "../assets/badge-coffee.png";
import badgeFirstBite from "../assets/badge-first-bite.png";
import badgeFoodExplorer from "../assets/badge-food-explorer.png";
import badgePlanStarter from "../assets/badge-plan-starter.png";

export const ACHIEVEMENTS = [
  {
    title: "First Bite",
    desc: "Join first food plan",
    badgeImg: badgeFirstBite,
    test: ({ joined }) => joined.length >= 1,
  },
  {
    title: "Plan Starter",
    desc: "Create your first food plan",
    badgeImg: badgePlanStarter,
    test: ({ created }) => created >= 1,
  },
  {
    title: "Food Explorer",
    desc: "Visit 5 different restaurants",
    badgeImg: badgeFoodExplorer,
    test: ({ places }) => places >= 5,
  },
  {
    title: "Table Builder",
    desc: "Host a lunch of 6 or more",
    test: ({ joined }) => joined.some((lunch) => lunch.participants.length >= 6),
  },
  {
    title: "Group Starter",
    desc: "Create or join a group",
    test: ({ groups }) => groups >= 1,
  },
  {
    title: "Regular",
    desc: "Be on 5 food plans at once",
    test: ({ joined }) => joined.length >= 5,
  },
  {
    title: "Coffee Addict",
    desc: "Join a plan at a cafe",
    badgeImg: badgeCoffee,
    test: ({ joined }) =>
      joined.some((lunch) => /brew|bean|coffee|cafe/i.test(lunch.restaurant || "")),
  },
  {
    title: "Sweet Tooth",
    desc: "Hit up dessert 5 times",
  },
  {
    title: "King of Food",
    desc: "Reach 50 completed lunches",
  },
  {
    title: "Bubble Tea Lover",
    desc: "Order bubble tea 5 times",
  },
];
