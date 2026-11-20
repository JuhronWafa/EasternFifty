import { useState } from "react";
import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

// const SIZES = ["S", "M", "L", "XL"];

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "low", label: "low to high" },
  { value: "high", label: "high to low" },
];

// const SORT_ICONS = {
//   featured: null,
//   low: "ri-arrow-down-line ri-lg",
//   high: "ri-arrow-up-line ri-lg",
// };

const toNumber = (price) => Number(String(price).replace(/[^0-9.]/g, ""));

// const COLORS = [...new Set(products.flatMap((p) => p.colors || []))];

const CATEGORIES = [
  "All Items",
  ...new Set(products.map((p) => p.category).filter(Boolean)),
];

function Shop() {
  const [category, setCategory] = useState("All Items");
  // const [size, setSize] = useState(null);
  // const [color, setColor] = useState(null);
  const [sort, setSort] = useState("featured");

  const filtered = products.filter(
    (p) => category === "All Items" || p.category === category,
  );
  // .filter((p) => !size || p.size?.includes(size))
  // .filter((p) => !color || p.colors?.includes(color));

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "low") return toNumber(a.price) - toNumber(b.price);
    if (sort === "high") return toNumber(b.price) - toNumber(a.price);
    return 0;
  });

  return (
    <main className="px-6 py-6 md:px-10">
      {/* Breadcrumb */}
      <nav className="text-xs uppercase tracking-widest text-zinc-500">
        <Link to="/" className="hover:text-black">
          <i className="ri-arrow-left-up-line ri-lg"></i> Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-black">Shop</span>
      </nav>

      <h1 className="mt-4 font-anton text-3xl uppercase leading-none md:text-5xl lg:text-6xl">
        The Eastern Archive.
      </h1>
      <p className="mt-2 text-sm text-zinc-600">
        Crafted from the eastern tip of Kediri. Everyday streetwear made to
        outlast trends.
      </p>
      {/* Breadcrumb */}

      <hr className="mt-6 border-zinc-300" />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr] lg:gap-8">
        {/* Sidebar Filter */}
        <aside className="space-y-6">
          <div>
            <p className="text-[10px] font-medium uppercase text-zinc-500">
              Filter by
            </p>
            <ul className="mt-3 flex gap-2 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible">
              {CATEGORIES.map((cat) => (
                <li key={cat} className="shrink-0">
                  <button
                    onClick={() => setCategory(cat)}
                    className={`w-full whitespace-nowrap px-3 py-2 text-left text-xs transition-colors capitalize ${category === cat ? "bg-gray-500 text-white" : "hover:bg-zinc-200"}`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Sidebar Filter */}
        </aside>

        {/* Card */}
        <div>
          <div className="flex font-medium items-center justify-between text-[10px] uppercase text-zinc-500">
            <p>{sorted.length} pieces</p>
            <label className="flex items-center gap-2">
              Sort:
              {/* {SORT_ICONS[sort] && (
                <i className={`${SORT_ICONS[sort]} text-sm text-black`}></i>
              )} */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent uppercase text-black outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {sorted.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </div>
        {/* Card */}
      </div>

      {sorted.length === 0 ? (
        <p className="py-20 text-center text-sm text-zinc-500">
          tidak ada Produk yang cocok dengan filter ini.
        </p>
      ) : (
        <p className="mt-16 text-center text-[10px] uppercase font-medium text-zinc-500">
          You've seen all {sorted.length} pieces. Make them yours.
        </p>
      )}
    </main>
  );
}

export default Shop;
