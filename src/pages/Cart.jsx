import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const FREE_SHIPPING_FROM = 500000;
const SHIPPING_FEE = 20000;
const MAX_QTY = 10;
const DISCOUNT_CODES = { EASTERN50: 0.1 };

const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const INITIAL_ITEMS = [
  {
    id: 1,
    name: "Away Days Jersey",
    price: 349000,
    image: "/assets/products/Jersey.png",
    size: "M",
    color: "Ecru / Navy",
    colors: ["Ecru / Navy", "Black / White"],
    qty: 1,
  },
  {
    id: 2,
    name: "Club Heavyweight Tee",
    price: 189000,
    image: "/assets/products/Tee.png",
    size: "M",
    color: "Washed Black",
    colors: ["Washed Black", "Off White"],
    qty: 1,
  },
];

const labelCls =
  "text-[11px] font-medium uppercase tracking-wide text-zinc-500";

const Select = ({ value, onChange, options, label, prefix = "" }) => (
  <div className="relative">
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none border border-zinc-300 bg-white py-2.5 pl-3 pr-8 text-xs text-black outline-none transition-colors focus:border-black"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {prefix}
          {o}
        </option>
      ))}
    </select>
    <i
      aria-hidden
      className="ri-arrow-down-s-line pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-base leading-none text-zinc-500"
    ></i>
  </div>
);

const EmptyCart = () => (
  <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
    <i
      aria-hidden
      className="ri-shopping-bag-line text-7xl leading-none text-zinc-300"
    ></i>
    <h1 className="mt-6 font-anton text-3xl capitalize leading-none md:text-5xl">
      Your cart is empty
    </h1>
    <p className="mt-3 text-xs text-zinc-600 md:text-sm">
      Let&apos;s find something for you.
    </p>
    <Link
      to="/shop"
      className="mt-8 bg-black px-8 py-4 text-xs font-medium uppercase text-white transition-colors hover:bg-zinc-800"
    >
      Continue shopping
    </Link>
  </main>
);

const Cart = () => {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState("");
  const [appliedCode, setAppliedCode] = useState(null);
  const [codeError, setCodeError] = useState("");

  const updateItem = (id, patch) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const removeItem = (id) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  if (items.length === 0) return <EmptyCart />;

  const pieces = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const rate = appliedCode ? DISCOUNT_CODES[appliedCode] : 0;
  const discount = Math.round(subtotal * rate);
  const freeShipping = subtotal >= FREE_SHIPPING_FROM;
  const shipping = freeShipping ? 0 : SHIPPING_FEE;
  const total = subtotal - discount + shipping;

  const applyCode = (e) => {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (DISCOUNT_CODES[clean]) {
      setAppliedCode(clean);
      setCodeError("");
    } else {
      setAppliedCode(null);
      setCodeError("This code isn't valid.");
    }
  };

  return (
    <main className="px-6 py-6 md:px-10">
      <nav className="text-xs uppercase tracking-widest text-zinc-500">
        <Link to="/" className="hover:text-black">
          <i className="ri-arrow-left-up-line ri-lg"></i> Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-black">Cart</span>
      </nav>
      {/* Breadcrumb */}

      {/* Header */}
      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-anton text-3xl uppercase leading-none md:text-5xl lg:text-6xl">
            Your matchday kit.
          </h1>
          <p className="mt-2 text-xs md:text-sm text-zinc-600">
            {pieces} {pieces === 1 ? "piece" : "pieces"}. One good decision.
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1 text-[10px] md:text-xs font-medium uppercase hover:opacity-60"
        >
          Continue shopping
          <i
            aria-hidden
            className="ri-arrow-right-up-line text-sm leading-none"
          ></i>
        </Link>
      </div>
      {/* Header */}

      <hr className="mt-6 border-zinc-300" />

      <section className="mt-8 grid gap-10 lg:grid-cols-[minimax(0,1.6fr)_minimax(0,1fr)]">
        {/* Daftar Produk */}
        <div>
          <div className="hidden grid-cols-[minmax(0,1fr)_140px_110px] border-b border-zinc-300 pb-4 md:grid">
            <span className={labelCls}>Product</span>
            <span className={labelCls}>Quantity</span>
            <span className={`${labelCls} text-right`}>Total</span>
          </div>
          {/* Daftar Produk */}

          {/* Awal */}
          <ul>
            {items.map((item) => (
              <li
                key={item.id}
                className="grid gap-4 border-b border-zinc-300 py-6 md:grid-cols-[minimax(0,1fr)_140px_110px] md:items-center"
              >
                {/* Produk */}
                <div className="flex gap-4 md:gap-5">
                  <div className="aspect-[3/4] w-24 shrink-0 bg-zinc-200 md:w-36">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <h2 className="text-sm font-medium md:text-base">
                      {item.name}
                    </h2>
                    <p className="mt-1 text-xs text-zinc-500">
                      {rupiah(item.price)}
                    </p>

                    <div className="mt-4 grid max-w-sm grid-cols-2 gap-2">
                      <select
                        label={`Size for ${item.name}`}
                        prefix="Size : "
                        value={item.size}
                        option={SIZES}
                        onChange={(v) => updateItem(item.id, { color: v })}
                      />
                      <select
                        label={`Colour for ${item.name}`}
                        value={item.color}
                        option={item.colors}
                        onChange={(v) => updateItem(item.id, { color: v })}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="mt-4 self-start text-xs text-zinc-500 underline-offset-4 hover:text-black hover:underline md:mt-auto"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Quantity + Total */}
                <div className="flex items-center justify-between md:contents">
                  <div className="inline-flex w-fit items-center border border-zinc-300 bg-white">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={item.qty <= 1}
                      onClick={() => updateItem(item.id, { qty: item.qty - 1 })}
                      className="px-3 py2.5
                       hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <i aria-hidden className="ri-subtract-line ri-lg"></i>
                    </button>
                    <span
                      className="w-8 text-center text-xs"
                      aria-live="polite"
                    >
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={item.qty >= MAX_QTY}
                      onClick={() => updateItem(item.id, { qty: item.id + 1 })}
                    >
                      <i aria-hidden className="ri-add-line ri-lg"></i>
                    </button>
                  </div>

                  <p className="text-sm font-medium md:text-right">
                    {rupiah(item.price * item.qty)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          {/* Akhir */}
        </div>
      </section>
    </main>
  );
};

export default Cart;
