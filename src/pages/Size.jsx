import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const GRAY = "#6b7280";

const TOP_COLS = [
  { key: "a", short: "A", label: "Chest", hint: "Armpit to armpit" },
  { key: "b", short: "B", label: "Length", hint: "Shoulder to hem" },
  { key: "c", short: "C", label: "Sleeve", hint: "Seam to cuff" },
];
const BOTTOM_COLS = [
  { key: "a", short: "A", label: "Waist", hint: "Across the waistband" },
  { key: "b", short: "B", label: "Hip", hint: "Across the widest point" },
  { key: "c", short: "C", label: "Length", hint: "Waistband to hem" },
];

const CATEGORIES = [
  {
    id: "tshirt",
    label: "T-Shirt",
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
    id: "hoodie",
    label: "Hoodies",
    cols: TOP_COLS,
    bands: [58, 68, 78, 88],
    data: {
      a: [58, 61, 64, 67, 70],
      b: [68, 71, 74, 77, 80],
      c: [60, 62, 64, 66, 68],
    },
    note: "Hoodies are cut heavy and relaxed. True to size for the intended drape, size down if you prefer it closer.",
  },
  {
    id: "shorts",
    label: "Shorts",
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

const FITS = [
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
    <rect x={x} y={y} width="22" height="22" className="fill-white" />
    <text
      x={x + 11}
      y={y + 16}
      textAnchor="middle"
      fontSize="13"
      fontWeight="700"
      className="fill-black"
    >
      {children}
    </text>
  </g>
);

const D = "fill-none stroke-zinc-600 stroke-2"; // gaya garis detail (jahitan dll.)

const DIAGRAMS = {
  // Boxy / drop shoulder, kerah rib bulat
  tshirt: {
    body: "M108 20 L62 36 Q34 48 14 94 L46 116 L74 100 L72 232 Q150 240 228 232 L226 100 L254 116 L286 94 Q266 48 238 36 L192 20 Q150 54 108 20 Z",
    details: [
      {
        d: "M114 22 Q150 54 186 22",
        cls: "fill-none stroke-zinc-500 stroke-[3]",
      },
      { d: "M72 220 Q150 228 228 220", cls: D },
      { d: "M24 88 L52 108", cls: D },
      { d: "M276 88 L248 108", cls: D },
    ],
    lines: [
      [74, 106, 226, 106],
      [150, 40, 150, 232],
      [62, 38, 30, 105],
    ],
    tags: [
      ["A", 80, 95],
      ["B", 139, 200],
      ["C", 10, 30],
    ],
  },

  // Kerah V, rib, panel samping
  jersey: {
    body: "M104 20 L60 34 Q30 46 18 92 L50 110 L78 92 L80 236 Q150 242 220 236 L222 92 L250 110 L282 92 Q270 46 240 34 L196 20 L150 70 Z",
    details: [
      {
        d: "M112 22 L150 62 L188 22",
        cls: "fill-none stroke-zinc-500 stroke-[3]",
      },
      { d: "M90 100 L92 236", cls: D },
      { d: "M210 100 L208 236", cls: D },
      { d: "M80 224 Q150 230 220 224", cls: D },
    ],
    lines: [
      [80, 100, 220, 100],
      [150, 72, 150, 238],
      [60, 36, 34, 101],
    ],
    tags: [
      ["A", 84, 89],
      ["B", 139, 200],
      ["C", 8, 30],
    ],
  },

  // Lengan panjang, kerah berdiri, zipper, kantong samping
  jacket: {
    body: "M108 22 Q104 14 120 12 L180 12 Q196 14 192 22 L232 36 Q256 46 264 76 L282 198 L252 204 L228 112 L226 236 Q150 244 74 236 L72 112 L48 204 L18 198 L36 76 Q44 46 68 36 Z",
    details: [
      { d: "M150 24 L150 238", cls: "fill-none stroke-zinc-500 stroke-2" },
      { d: "M112 24 L150 44 L188 24", cls: D },
      { d: "M92 150 L92 190", cls: D },
      { d: "M208 150 L208 190", cls: D },
      { d: "M74 222 Q150 230 226 222", cls: D },
      { d: "M21 184 L50 190", cls: D },
      { d: "M279 184 L250 190", cls: D },
    ],
    lines: [
      [72, 112, 228, 112],
      [112, 26, 112, 238],
      [62, 44, 33, 198],
    ],
    tags: [
      ["A", 80, 101],
      ["B", 101, 205],
      ["C", 4, 110],
    ],
  },

  // Hood, tali, kantong kangaroo, rib manset dan ujung
  hoodie: {
    body: "M104 30 Q100 6 150 4 Q200 6 196 30 L234 42 Q258 52 266 80 L282 196 L252 202 L228 116 L226 236 Q150 244 74 236 L72 116 L48 202 L18 196 L34 80 Q42 52 66 42 Z",
    details: [
      {
        d: "M112 26 Q150 78 188 26 Q150 14 112 26 Z",
        cls: "fill-zinc-900 stroke-zinc-600 stroke-2",
      },
      { d: "M132 60 L130 98", cls: "fill-none stroke-zinc-500 stroke-2" },
      { d: "M168 60 L170 98", cls: "fill-none stroke-zinc-500 stroke-2" },
      { d: "M96 160 L204 160 L216 214 L84 214 Z", cls: D },
      { d: "M74 224 Q150 232 226 224", cls: D },
      { d: "M21 186 L50 192", cls: D },
      { d: "M279 186 L250 192", cls: D },
    ],
    lines: [
      [72, 116, 228, 116],
      [150, 40, 150, 236],
      [62, 46, 33, 198],
    ],
    tags: [
      ["A", 78, 105],
      ["B", 139, 176],
      ["C", 4, 110],
    ],
  },

  // Pendek, di atas lutut, pinggang karet dan tali
  shorts: {
    body: "M86 36 Q150 44 214 36 L236 176 Q236 182 230 182 L166 182 L150 112 L134 182 L70 182 Q64 182 64 176 Z",
    details: [
      { d: "M86 52 Q150 60 214 52", cls: D },
      { d: "M140 48 L138 70", cls: "fill-none stroke-zinc-500 stroke-2" },
      { d: "M160 48 L162 70", cls: "fill-none stroke-zinc-500 stroke-2" },
      { d: "M67 170 L135 170", cls: D },
      { d: "M165 170 L233 170", cls: D },
    ],
    lines: [
      [86, 44, 214, 44],
      [78, 96, 222, 96],
      [108, 42, 108, 182],
    ],
    tags: [
      ["A", 139, 33],
      ["B", 139, 85],
      ["C", 97, 140],
    ],
  },

  // Panjang, sedikit meruncing, garis samping, ban kaki
  pants: {
    body: "M84 14 Q150 22 216 14 L240 232 Q241 240 232 240 L172 240 L150 96 L128 240 L68 240 Q59 240 60 232 Z",
    details: [
      { d: "M85 30 Q150 38 215 30", cls: D },
      { d: "M140 26 L138 52", cls: "fill-none stroke-zinc-500 stroke-2" },
      { d: "M160 26 L162 52", cls: "fill-none stroke-zinc-500 stroke-2" },
      { d: "M92 44 L72 228", cls: D },
      { d: "M208 44 L228 228", cls: D },
      { d: "M62 226 L130 226", cls: D },
      { d: "M170 226 L238 226", cls: D },
    ],
    lines: [
      [84, 22, 216, 22],
      [80, 72, 220, 72],
      [104, 18, 104, 240],
    ],
    tags: [
      ["A", 139, 11],
      ["B", 139, 61],
      ["C", 93, 200],
    ],
  },
};

const Diagram = ({ type }) => {
  const d = DIAGRAMS[type] ?? DIAGRAMS.tshirt;
  return (
    <svg
      viewBox="0 0 300 260"
      className="h-full w-full"
      role="img"
      aria-label="Measurement diagram"
    >
      {/* Siluet */}
      <path d={d.body} className="fill-zinc-800" />

      {/* Aksen (zipper, hood, kantong) */}
      {d.details?.map((p, i) => (
        <path key={i} d={p.d} className={p.cls} />
      ))}

      {/* Garis ukur A, B, C */}
      <g className="stroke-white" strokeWidth="3">
        {d.lines.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>

      {/* Label A, B, C */}
      {d.tags.map(([t, x, y]) => (
        <Tag key={t} x={x} y={y}>
          {t}
        </Tag>
      ))}
    </svg>
  );
};

const fieldCls =
  "w-full border border-zinc-300 bg-white px-4 py-3 pr-12 text-xs md:text-sm text-black outline-none transition-colors placeholder:text-zinc-400 focus:border-black/50";
const labelCls =
  "text-[10px] font-medium uppercase tracking-wide text-zinc-500";

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
      <p className="mt-2 text-xs md:text-sm text-zinc-600">
        Tell us your height and weight. We will point you to the right size.
      </p>
      {/* Header */}

      <hr className="mt-6 border-zinc-300" />

      {/* Finder */}
      <section className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <form
          onSubmit={handleSubmit}
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
                  className={`shrink-0 whitespace-nowrap px-3 py-3 text-left text-xs transition-colors ${c.id === catId ? "bg-black text-white" : "hover:bg-zinc-200"}`}
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
          <p className={`${labelCls} mt-8`}>03 · Fit preference</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {FITS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFit(f.id)}
                className={`px-3 py-3 text-left text-xs transition-colors ${f.id === fit ? "bg-black text-white" : "hover:bg-zinc-200"}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {error && (
            <p role="alert" className="mt-5 text-xs text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-8 flex w-full items-center justify-between bg-gray-500 px-6 py-4 text-xs font-medium text-white transition-colors hover:bg-zinc-800 sm:w-auto sm:gap-10"
          >
            Find My Size
            <i
              aria-hidden
              className="ri-arrow-right-up-line ri-lg text-base leading-none"
            ></i>
          </button>
        </form>

        {/* Result */}
        <aside
          className="flex min-h-[260px] flex-col items-center justify-center bg-white text-center p-6 text-white md:p-8"
          aria-live="polite"
        >
          <p className="text-xs font-medium capitalize tracking-wide text-black md:text-sm">
            Recommended Size · {cat.label}
          </p>
          {result ? (
            <div className="flex flex-col items-center">
              <p className="mt-2 font-anton text-7xl leading-none text-black md:text-8xl lg:text-9xl">
                {SIZES[result.index]}
              </p>
              {result.altIndex !== null && (
                <p className="mt-4 text-xs md:text-sm text-black">
                  You are between{" "}
                  {SIZES[Math.min(result.index, result.altIndex)]} and{" "}
                  {SIZES[Math.max(result.index, result.altIndex)]}. Pick the
                  bigger one for a roomier feel.
                </p>
              )}
              <p className="mt-4 text-[10px] md:text-xs uppercase text-black">
                {submitted.height} cm · {submitted.weight} kg ·{" "}
                {FITS.find((f) => f.id === fit).label} fit
              </p>
            </div>
          ) : (
            <div>
              <p className="font-anton text-7xl leading-none text-black md:text-8xl lg:text-9xl">
                -
              </p>
              <p className="mt-4 text-xs md:text-sm text-black">
                Fill in your height and weight to see your size
              </p>
            </div>
          )}
        </aside>
      </section>

      {/* Measurements + Diagram */}
      <section className="mt-16 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-medium uppercase">
              Garment measurements
            </h2>
            <div className="inline-flex bg-zinc-200/70 p-0.5 text-[10px] md:text-[11px] font-medium">
              {["cm", "in"].map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={`px-6 py-2.5 uppercase transition-colors ${unit === u ? "bg-black text-white" : "text-black"}`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <table className="w-full table-fixed text-left text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-500 text-[10px] md:text-xs uppercase text-white">
                  <th className="px-5 py-5 font-medium">Size</th>
                  {cat.cols.map((c) => (
                    <th key={c.key} className="px-5 py-5 font-medium">
                      {c.short} · {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZES.map((s, i) => (
                  <tr
                    key={s}
                    className={`border-b border-zinc-300 ${result && result.index === i ? "bg-zinc-200" : ""}`}
                  >
                    <td className="px-5 py-5 font-medium">{s}</td>
                    {cat.cols.map((c) => (
                      <td key={c.key} className="px-5 py-5">
                        {fmt(cat.data[c.key][i])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[10px] md:text-xs text-zinc-500">
            Measured flat in {unit === "cm" ? "centimetres" : "inches"}. Allow ±
            {unit === "cm" ? "2 cm" : "0.8 in"} for garment variation.
          </p>

          <div className="mt-10 bg-black p-6 text-white md:p-8">
            <h3 className="font-anton text-2xl md:text-3xl uppercase leading-none">
              A little room to move.
            </h3>
            <p className="mt-4 max-w-md text-xs md:text-sm text-zinc-400">
              {cat.note}
            </p>
          </div>
        </div>

        <div>
          <div className="bg-zinc-200 p-6">
            <div className="relative aspect-[4/3] bg-zinc-300 p-6">
              <p className="absolute left-4 top-4 text-[10px] font-bold  tracking-wide text-black md:text-xs">
                {cat.label}
              </p>
              <Diagram type={cat.id} />
            </div>
            <h3 className="mt-6 text-xs font-medium uppercase">
              How to measure
            </h3>
            <p className="mt-3 text-[10px] md:text-xs text-zinc-500">
              Lay the garment flat. Compare with a favourite piece.
            </p>
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-4">
            {cat.cols.map((c) => (
              <div key={c.key}>
                <dt className="text-[10px] md:text-xs font-medium uppercase">
                  {c.short} {c.label}
                </dt>
                <dd className="mt-2 text-[10px] md:text-xs text-zinc-500">
                  {c.hint}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Contact */}
      <p className="mt-16 text-[10px] md:text-xs font-medium uppercase">
        Still not sure?{" "}
        <a
          href="https://instagram.com/easternfifty"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:opacity-60"
        >
          Contact the club{" "}
          <i aria-hidden className="ri-arrow-right-up-line ri-lg"></i>
        </a>
      </p>
    </main>
  );
};

export default Size;
