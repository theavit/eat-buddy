import fishAmok from "../assets/fish-amok.jpg";
import kuyTeav from "../assets/kuy-teav.jpg";
import lokLak from "../assets/lok-lak.jpg";
import marketStall from "../assets/market-stall.jpg";
import nightMarketSkewers from "../assets/night-market-skewers.jpg";
import numBanhChok from "../assets/num-banh-chok.jpg";
import numPang from "../assets/num-pang.jpg";
import pepperCrab from "../assets/pepper-crab.jpg";
import streetRestaurant from "../assets/street-restaurant.jpg";

export const MOMENT_CATEGORIES = [
  "All",
  "Lunch",
  "Coffee",
  "Dessert",
  "Drinks",
  "Dinner",
  "Healthy",
];

export const MOMENTS = [
  {
    user: "Sokha",
    time: "2h ago",
    restaurant: "Malis",
    dish: "Fish Amok",
    tag: "Recommended!",
    caption: "Steamed in banana leaf, so creamy. Worth the walk in this heat.",
    likes: 24,
    comments: 6,
    h: 230,
    photo: fishAmok,
  },
  {
    user: "Dara",
    time: "3h ago",
    restaurant: "Romdeng",
    dish: "Beef Lok Lak",
    tag: "Recommended!",
    caption: "Peppery sauce, runny egg on top. Classic done right.",
    likes: 18,
    comments: 2,
    h: 190,
    photo: lokLak,
  },
  {
    user: "Meylin",
    time: "4h ago",
    restaurant: "Boat Noodle",
    dish: "Num Banh Chok",
    tag: "Highly recommend!",
    caption: "Breakfast of champions. The green curry broth is everything.",
    likes: 21,
    comments: 3,
    h: 210,
    photo: numBanhChok,
  },
  {
    user: "Vuthy",
    time: "5h ago",
    restaurant: "Brown Coffee",
    dish: "Num Pang & Iced Coffee",
    tag: "Recommended!",
    caption: "Grabbed one before the 9am standup. Crunchy baguette, still warm.",
    likes: 16,
    comments: 1,
    h: 200,
    photo: numPang,
  },
  {
    user: "Sreyneang",
    time: "6h ago",
    restaurant: "Night Market",
    dish: "Grilled Skewers",
    tag: "Love it!",
    caption: "Team went after work. Pick your sticks, they grill it in front of you.",
    likes: 13,
    comments: 4,
    h: 230,
    photo: nightMarketSkewers,
  },
  {
    user: "Ratanak",
    time: "7h ago",
    restaurant: "Kampot Fish House",
    dish: "Kampot Pepper Crab",
    tag: "Highly recommend!",
    caption: "Green peppercorns straight off the vine. Messy and worth it.",
    likes: 22,
    comments: 5,
    h: 195,
    photo: pepperCrab,
  },
  {
    user: "Pich",
    time: "8h ago",
    restaurant: "Kuy Teav Hong Kong",
    dish: "Kuy Teav Phnom Penh",
    tag: "Recommended!",
    caption: "The noodle soup that shares our city name. Nothing beats it early.",
    likes: 19,
    comments: 5,
    h: 215,
    photo: kuyTeav,
  },
  {
    user: "Nina",
    time: "9h ago",
    restaurant: "Phsar Thmey",
    dish: "Market Lunch Run",
    tag: "Recommended!",
    caption: "Whole team ate for under $15. Central Market never misses.",
    likes: 9,
    comments: 1,
    h: 185,
    photo: marketStall,
  },
  {
    user: "Bora",
    time: "10h ago",
    restaurant: "Street 278",
    dish: "Late Night Rice",
    tag: "Love it!",
    caption: "Plastic stools, cold drinks, open till late. Our usual spot.",
    likes: 14,
    comments: 2,
    h: 205,
    photo: streetRestaurant,
  },
];

export const MOMENT_COMMENTS = [
  {
    name: "Lily Nguyen",
    text: "This looks amazing, adding it to my list!",
    time: "1h ago",
  },
  {
    name: "Marcus Reed",
    text: "Went here last week, so good.",
    time: "40m ago",
  },
];

export const MOMENT_RATINGS = [
  {
    v: "Love it!",
    e: "😍",
  },
  {
    v: "Recommended!",
    e: "🙂",
  },
  {
    v: "Okay",
    e: "😐",
  },
  {
    v: "Not really",
    e: "👎",
  },
];
