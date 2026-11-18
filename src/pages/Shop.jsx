import { useState } from "react";
import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

const SIZES = ["S", "M", "L", "XL"];

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "low", label: "Price: low to high" },
  { vale: "high", label: "Price: high to low" },
];

const toNumber = (price) => Number(String(price).replace(/[^0-9.]/g, ""));

const COLORS = [...new Set(products.flatMap((p) => p.colors || []))];

const CATEGORIES = [
  "All",
  ...new Set(products.map((p) => p.category).filter(Boolean)),
];

function Shop() {
  const [category, setCategory] = useState("All");
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [sort, setSort] = useState("featured");

  const filtered = products
    .filter((p) => category === "All" || p.category)
    .filter((p) => !size || p.size?.includes(size))
    .filter((p) => !color || p.colors?.includes(color));

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "low") return toNumber(a.price) - toNumber(b.price);
    if (sort === "high") return toNumber(b.price) - toNumber(a.price);
    return 0;
  });

  return (
    <main className="px-6 py-6 md:px-10 md:py-6">
      <p className="text-[10px] uppercase tracking-widest text-zinc-500 md:text-xs">
        All products
      </p>
      <h1 className="mt-4 font-anton text-5xl uppercase leading-none md:text-7xl">
        Shop.
      </h1>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}

export default Shop;
