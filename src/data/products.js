export const formatRupiah = (n) =>
  "Rp " +
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const baseProducts = [
  {
    id: 1,
    name: "Terrace Stripe Jersey",
    price: 420000,
    variant: "Black / Ecru",
    badge: "Bestseller",
    image: "/assets/products/Jersey.png",
    colors: ["#111111", "#ece8dc"],
  },
  {
    id: 2,
    name: "Away Days Track Jacket",
    price: 600000,
    variant: "Grey / Slate Blue",
    badge: "New",
    image: "/assets/products/TrackJacket.png",
    colors: ["#c4c8ca", "#7f9aa6"],
  },
  {
    id: 3,
    name: "Club Heavyweight Tee",
    price: 250000,
    variant: "Black / Red",
    badge: "New",
    image: "/assets/products/Tee.png",
    colors: ["#111111", "#c8102e"],
  },
  {
    id: 4,
    name: "90-Minute Track Pant",
    price: 480000,
    variant: "Grey / Slate Blue",
    image: "/assets/products/TrackPant.png",
    colors: ["#c4c8ca", "#7f9aa6"],
  },

  //   Product Baru
  {
    id: 5,
    name: "Stadium Heavyweight Hoodie",
    price: 520000,
    variant: "Charcoal / White",
    badge: "New",
    image: "/assets/products/Hoodie.png",
    colors: ["#4a4a4e", "#ffffff"],
  },
  {
    id: 6,
    name: "Terrace Long Sleeve",
    price: 320000,
    variant: "White / Blue",
    image: "/assets/products/LongSleeve.png",
    colors: ["#ffffff", "#1f5fa8"],
  },
  {
    id: 7,
    name: "Training Football Shorts",
    price: 290000,
    variant: "Navy / Red",
    image: "/assets/products/Shorts.png",
    colors: ["#14213d", "#d7261e"],
  },
  {
    id: 8,
    name: "Matchday Windbreaker",
    price: 560000,
    variant: "Navy / Red",
    badge: "New",
    image: "/assets/products/Windbreaker.png",
    colors: ["#14213d", "#d7261e"],
  },
  {
    id: 9,
    name: "Matchday Away Jersey",
    price: 450000,
    variant: "Red / Navy",
    image: "/assets/products/Tshirt.png",
    colors: ["#d7261e", "#14213d"],
  },
  {
    id: 10,
    name: "Club Crest Cap",
    price: 220000,
    variant: "Navy / White",
    image: "/assets/products/Cap.png",
    colors: ["#14213d", "#ffffff"],
  },
  {
    id: 11,
    name: "Matchday Supporters Scarf",
    price: 200000,
    variant: "Red / White",
    image: "/assets/products/Scarf.png",
    colors: ["#c8102e", "#ffffff"],
  },
  {
    id: 12,
    name: "Touchline Socks",
    price: 120000,
    variant: "Navy / Red / Blue",
    image: "/assets/products/Socks.png",
    colors: ["#14213d", "#d7261e", "#1f5fa8"],
  },
];

const APPAREL = ["S", "M", "L", "XL"];

const CATEGORY_DESCRIPTIONS = {
  Jerseys:
    "Classic collar cut inspired by retro terrace wear. Sharp enough for the streets, comfortable for long matchday rides.",
  Jackets:
    "Built to handle cold night rides from the eastern border to the stadium. Durable outer shell with subtle 1950 details.",
  "T-Shirts":
    "Crafted from heavyweight cotton for daily wear. Clean terrace silhouette carrying the pride of the East.",
  Pants:
    "Relaxed track cut made for the walk to the stadium and everything after the final whistle. Easy to wear, hard to outgrow.",
  Hoodies:
    "Heavyweight fleece for chilly matchday mornings. A quiet silhouette with the weight of the 1950 legacy.",
  Shorts:
    "Lightweight and made to move, from training days to warm evenings on the terrace. No loud logos, just pure pride.",
  Accessories:
    "The finishing touch for every matchday. Small details stitched with the spirit of the East.",
};

const extra = {
  1: {
    category: "Jerseys",
    sizes: APPAREL,
    material:
      "100% polyester jersey with tonal stripe knit. Contrast ecru collar and cuffs. Machine wash cold.",
  },
  2: {
    category: "Jackets",
    sizes: APPAREL,
    material:
      "Gingham-check ripstop nylon body with slate blue panels. Mesh lining. Wash cold, hang dry.",
  },
  3: {
    category: "T-Shirts",
    sizes: APPAREL,
    material:
      "100% heavyweight cotton, 240 gsm, with a screen-printed chest graphic. Wash inside out, cold.",
  },
  4: {
    category: "Pants",
    sizes: APPAREL,
    material:
      "Gingham-check nylon with slate blue side panels and elasticated cuffs. Machine wash cold.",
  },
  5: {
    category: "Hoodies",
    sizes: APPAREL,
    material:
      "80% cotton, 20% polyester brushed fleece, 400 gsm, with a screen-printed box logo. Wash inside out.",
  },
  6: {
    category: "T-Shirts",
    sizes: APPAREL,
    material:
      "100% combed cotton jersey with a front print and sleeve graphics. Machine wash cold.",
  },
  7: {
    category: "Shorts",
    sizes: APPAREL,
    material:
      "100% recycled polyester with a tonal jacquard pattern and elastic waistband. Machine wash cold.",
  },
  8: {
    category: "Jackets",
    sizes: APPAREL,
    material:
      "Lightweight water-resistant nylon shell with contrast side panels and printed lining. Wash cold, do not tumble dry.",
  },
  9: {
    category: "Jerseys",
    sizes: APPAREL,
    material:
      "100% recycled polyester jacquard with a rib-knit collar and cuffs. Moisture-wicking. Machine wash cold, do not iron the crest.",
  },
  10: {
    category: "Accessories",
    sizes: [],
    material:
      "100% cotton twill, 6-panel, with an embroidered crest and adjustable strap. Spot clean only.",
  },
  11: {
    category: "Accessories",
    sizes: [],
    material:
      "Striped acrylic knit with woven crest patches and fringed ends. Hand wash cold, dry flat.",
  },
  12: {
    category: "Accessories",
    sizes: [],
    material:
      "80% cotton, 15% polyester, 5% elastane with ribbed cuffs. Machine wash cold.",
  },
};

export const products = baseProducts.map((p) => {
  const e = extra[p.id];
  return {
    ...p,
    ...e,
    description: e.description ?? CATEGORY_DESCRIPTIONS[e.category],
  };
});
