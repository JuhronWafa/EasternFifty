import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const GRAY = "text-gray-500";

const TOP_COLS = [
  { key: "a", short: "A", label: "Chest", hint: "Armpit to armpit" },
  { key: "b", short: "B", label: "Length", hint: "Shoulder to hem" },
  { key: "C", short: "C", label: "Sleeve", hint: "Seam to cuff" },
];
const BOTTOM_COLS = [
  { key: "a", short: "A", label: "Waist", hint: "Across the waistband" },
  { key: "b", short: "B", label: "Hip", hint: "Across the widest point" },
  { key: "C", short: "C", label: "Length", hint: "Waistband to hem" },
];

const CATEGORIES = [
  {
    id: "tshirt",
    label: "T-Shirt",
    diagram: "top",
    cols: TOP_COLS,
    bands: [58, 68, 78, 88],
    data: {
      a: [56, 59, 62, 65, 68],
      b: [70, 73, 76, 79, 82],
      c: [22, 23, 24, 25, 26],
    },
    note: "Our tees have a boxy, oversized fit. Choose your usual size for the intended silhouette, or size down for a closer fit.",
  },
  {
    id: "jersey",
    label: "Jerseys",
    diagram: "top",
    cols: TOP_COLS,
    bands: [56, 66, 76, 86],
    data: {
      a: [54, 57, 60, 63, 66],
      b: [71, 74, 77, 80, 83],
      c: [21, 22, 23, 24, 25],
    },
    note: "Jerseys are cut straighter and a little closer to the body. Stay true to size for match-day shape, size up if you like it loose.",
  },
  {
    id: "jacket",
    label: "Jackets",
    diagram: "top",
    cols: [
      TOP_COLS[0],
      TOP_COLS[1],
      { key: "c", short: "C", label: "Sleeve", hint: "Shoulder seam to cuff" },
    ],
    bands: [58, 68, 78, 88],
    data: {
      a: [60, 63, 66, 69, 72],
      b: [68, 71, 74, 77, 80],
      c: [62, 64, 66, 68, 70],
    },
    note: "Jackets are made with room for a layer underneath. If you plan to wear it over a hoodie, consider sizing up.",
  },
  {
    id: "shorts",
    label: "Shorts",
    diagram: "bottom",
    cols: BOTTOM_COLS,
    bands: [60, 70, 80, 90],
    data: {
      a: [38, 40, 42, 44, 46],
      b: [52, 54, 56, 58, 60],
      c: [44, 46, 48, 50, 52],
    },
    note: "Shorts sit relaxed on the hip with an elastic waist, so they forgive a little give either way.",
  },
  {
    id: "pants",
    label: "Pants",
    diagram: "bottom",
    cols: BOTTOM_COLS,
    bands: [60, 70, 80, 90],
    data: {
      a: [38, 40, 42, 44, 46],
      b: [54, 56, 58, 60, 62],
      c: [100, 102, 104, 106, 108],
    },
    note: "Pants have a straight, relaxed leg. If you are taller than 183 cm, we suggest going one size up for extra length.",
  },
];

const FIT = [
  { id: "closer", label: "Closer", adj: -1 },
  { id: "regular", label: "Regular", adj: 0 },
  { id: "roomier", label: "Roomier", adj: 1 },
];

const clamp = (n) => Math.max(0, Math.min(SIZES.length - 1, n));

function recommend(cat, height, weight, fitId) {
  const fitAdj = FITS.find((f) => f.id === fitId)?.adj ?? 0;
  const heightAdj = height >= 183 ? 1 : height <= 160 ? -1 : 0;

  let base = cat.bands.findIndex((limit) => weight <= limit);
  if (base === -1) base = SIZES.length - 1;

  const index = clamp(base + heightAdj + fitAdj);

  const toNext = base < cat.bands.length ? cat.bands[base] - weight : Infinity;
  const toPrev = base > 0 ? weight - cat.bands[base - 1] : Infinity;
  let altBase = null;
  if (toNext <= 2) altBase = base + 1;
  else if (toPrev <= 2) altBase = base - 1;

  const altIndex =
    altBase === null ? null : clamp(altBase + heightAdj + fitAdj);

  return {
    index,
    altIndex: altIndex !== null && altIndex !== index ? altIndex : null,
    heightAdj,
  };
}

const Tag = ({ x, y, children }) => (
  <g>
    <rect x={x} y={y} width="22" height="22" fill={GRAY} />
    <text
      x={x + 11}
      y={y + 16}
      textAnchor="middle"
      fontSize="13"
      fontWeight="700"
      fill="#000"
    >
      {children}
    </text>
  </g>
);

const Diagram = ({ type }) =>
  type === "top" ? (
    <svg
      viewBox="0 0 300 260"
      className="h-full w-full"
      role="img"
      aria-label="Top measurement diagram"
    >
      <path
        d="M100 20 L60 40 L20 90 L50 110 L70 95 L70 240 L230 240 L230 95 L250 110 L280 90 L240 40 L200 20 Q150 52 100 20 Z"
        fill="#1f1f1f"
      />
      <g stroke={GRAY} strokeWidth="3">
        <line x1="70" y1="110" x2="230" y2="110" />
        <line x1="150" y1="36" x2="150" y2="240" />
        <line x1="66" y1="42" x2="34" y2="96" />
      </g>
      <Tag x={76} y={99}>
        A
      </Tag>
      <Tag x={139} y={212}>
        B
      </Tag>
      <Tag x={8} y={28}>
        C
      </Tag>
    </svg>
  ) : (
    <svg
      viewBox="0 0 300 260"
      className="h-full w-full"
      role="img"
      aria-label="Bottom measurement diagram"
    >
      <path
        d="M90 20 L210 20 L228 240 L166 240 L150 100 L134 240 L72 240 Z"
        fill="#1f1f1f"
      />
      <g stroke={LIME} strokeWidth="3">
        <line x1="90" y1="30" x2="210" y2="30" />
        <line x1="84" y1="78" x2="216" y2="78" />
        <line x1="108" y1="22" x2="108" y2="240" />
      </g>
      <Tag x={139} y={19}>
        A
      </Tag>
      <Tag x={139} y={67}>
        B
      </Tag>
      <Tag x={97} y={204}>
        C
      </Tag>
    </svg>
  );

const fieldCls =
  "w-full border border-zinc-300 bg-white px-4 py-3 pr-12 text-xs text-black outline-none transition-colors placeholder:text-zinc-400 focus:border-black";
const labelCls =
  "text-[11px] font-medium uppercase tracking-wide text-zinc-500";

const Size = () => {
  const [catId, setCatId] = useState("tshirt");
  const [unit, setUnit] = useState("cm");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fit, setFit] = useState("regular");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(null);

  const cat = CATEGORIES.find((c) => c.id === catId);

  const result = useMemo(
    () =>
      submitted
        ? recommend(cat, submitted.height, submitted.weight, fit)
        : null,
    [submitted, cat, fit],
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const h = Number(height);
    const w = Number(weight);
    if (!h || h < 120 || h > 230) {
      setError("Enter your height between 120 and 230 cm.");
      return;
    }
    if (!w || w < 30 || w > 200) {
      setError("Enter your weight between 30 and 200 kg.");
      return;
    }
    setError("");
    setSubmitted({ height: h, weight: w });
  };

  const fmt = (v) => (unit === "cm" ? v : (v / 2.54).toFixed(1));

  return (
    <main className="px-6 py-6 md:px-10">
      {/* Breadcrumb */}
      <nav className="text-xs uppercase tracking-widest text-zinc-500">
        <Link to="/" className="hover:text-black">
          <i className="ri-arrow-left-up-line ri-lg"></i> Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-black">Size</span>
      </nav>
      {/* Breadcrumb */}

      {/* Header */}
      <h1 className="mt-4 font-anton text-3xl uppercase leading-none md:text-5xl lg:text-6xl">
        Find your fit.
      </h1>
      <p className="mt-2 text-sm text-zinc-600">
        Tell us your height and weight. We will point you to the right size.
      </p>
      {/* Header */}

      {/* Finder */}
      <section className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <form
        // onSubmit={handleSubmit}
        // className="border border-zinc-300 p-6 md:p-8"
        >
          {/* Step 1 */}
          <div className="min-w-0">
            <p className={labelCls}>01 · Category</p>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCatId(c.id)}
                  className={`shrink-0 whitespace-nowrap px-3 py-3 text-left text-xs transition-colors ${c.id === catId ? "bg-gray-500 text-white" : "hover:bg-zinc-200"}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2 */}
          <p className={`${labelCls} mt-8`}>02 · Your Body</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                min="120"
                max="230"
                placeholder="Height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className={fieldCls}
                aria-label="Height in centimetres"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                cm
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                min="30"
                max="200"
                placeholder="Weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className={fieldCls}
                aria-label="Weight in kilograms"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                kg
              </span>
            </div>
          </div>

          {/* Step 3 */}
        </form>
      </section>
    </main>
  );
};

export default Size;
