import fishAmok from "../assets/fish-amok.jpg";
import kuyTeav from "../assets/kuy-teav.jpg";
import nightMarketSkewers from "../assets/night-market-skewers.jpg";
import numBanhChok from "../assets/num-banh-chok.jpg";
import numPang from "../assets/num-pang.jpg";
import streetRestaurant from "../assets/street-restaurant.jpg";
import sushi from "../assets/sushi.jpg";
import tacos from "../assets/tacos.jpg";

export const RESTAURANTS = [
  {
    id: "r1",
    name: "Mori Kitchen",
    cuisine: "Japanese",
    price: "$$",
    rating: "4.8",
    reviews: 42,
    walk: "6 min walk",
    description: "Ramen, donburi and a tidy little sushi counter at the back.",
    photo: kuyTeav,
  },
  {
    id: "r2",
    name: "Green Bowl",
    cuisine: "Healthy",
    price: "$",
    rating: "4.6",
    reviews: 31,
    walk: "4 min walk",
    description: "Build-your-own grain bowls and cold-pressed juice.",
    photo: numBanhChok,
  },
  {
    id: "r3",
    name: "Pho Haven",
    cuisine: "Vietnamese",
    price: "$$",
    rating: "4.5",
    reviews: 28,
    walk: "8 min walk",
    description: "Slow-simmered broth, banh mi, and iced coffee worth the walk.",
    photo: numPang,
  },
  {
    id: "r4",
    name: "Spice Route",
    cuisine: "Indian",
    price: "$$",
    rating: "4.7",
    reviews: 36,
    walk: "7 min walk",
    description: "Curries by the ladle plus a dessert counter for gulab jamun.",
    photo: fishAmok,
  },
  {
    id: "r5",
    name: "Sushi Kichi",
    cuisine: "Japanese",
    price: "$$$",
    rating: "4.9",
    reviews: 54,
    walk: "10 min walk",
    description: "Fresh nigiri and rolls — a treat-yourself kind of lunch.",
    photo: sushi,
  },
  {
    id: "r6",
    name: "Brew & Bean",
    cuisine: "Cafe",
    price: "$",
    rating: "4.3",
    reviews: 19,
    walk: "2 min walk",
    description: "Coffee, tea and pastries for a mid-afternoon regroup.",
    photo: streetRestaurant,
  },
  {
    id: "r7",
    name: "Golden Dragon",
    cuisine: "Buffet",
    price: "$$",
    rating: "4.4",
    reviews: 26,
    walk: "12 min walk",
    description: "All-you-can-eat, great for bigger cross-team groups.",
    photo: nightMarketSkewers,
  },
  {
    id: "r8",
    name: "Taco Fiesta",
    cuisine: "Healthy",
    price: "$",
    rating: "4.4",
    reviews: 22,
    walk: "9 min walk",
    description: "Quick tacos and burritos with a build-your-own line.",
    photo: tacos,
  },
];

export const RESTAURANT_PHOTOS = Object.fromEntries(
  RESTAURANTS.map((restaurant) => [restaurant.name, restaurant.photo]),
);
