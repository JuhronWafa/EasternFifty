import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const FREE_SHIPPING_FROM = 500000;
const SHIPPING_FEE = 20000;
const MAX_QTY = 10;
const DISCOUNT_CODES = { EASTERN10: 0.1, EASTERN20: 0.2 };

const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const labelCls =
  "text-[11px] font-medium uppercase tracking-wide text-zinc-500";

const Select = ({ value, onChange, options, label, prefix = "" }) => (
  <div className="relative">
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 w-full appearance-none border border-zinc-300 bg-white pl-3 pr-8 text-[10px] text-black outline-none transition-colors focus:border-black md:text-xs"
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
      className="ri-arrow-down-s-line pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-sm leading-none text-zinc-500"
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
  const { items, updateItem, removeItem } = useCart();

  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState("");
  const [appliedCode, setAppliedCode] = useState(null);
  const [codeError, setCodeError] = useState("");

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

      <section className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
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
                key={item.lineId}
                className="grid gap-4 border-b border-zinc-300 py-6 md:grid-cols-[minmax(0,1fr)_140px_110px] md:items-center"
              >
                {/* Produk */}
                <div className="flex gap-4 md:gap-5">
                  <div className="aspect-3/4 w-24 shrink-0 bg-zinc-200 md:w-36">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <h2 className="text-xs font-semibold md:text-sm">
                      {item.name}
                    </h2>
                    <p className="mt-1 text-[10px] md:text-xs text-zinc-500">
                      {rupiah(item.price)}
                    </p>

                    <div className="mt-4 grid max-w-xs grid-cols-2 gap-2">
                      {item.size !== "-" && (
                        <Select
                          label={`Size for ${item.name}`}
                          // prefix="Size : "
                          value={item.size}
                          options={item.sizes ?? SIZES}
                          onChange={(v) => updateItem(item.lineId, { size: v })}
                        />
                      )}
                      {item.colors?.length > 0 && (
                        <Select
                          label={`Colour for ${item.name}`}
                          value={item.color}
                          options={item.colors}
                          onChange={(v) =>
                            updateItem(item.lineId, { color: v })
                          }
                        />
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.lineId)}
                      className="mt-4 self-start text-[10px] md:text-xs text-zinc-500 underline-offset-4 hover:text-red-600 md:mt-auto"
                    >
                      Remove <i className="ri-delete-bin-line ri-lg"></i>
                    </button>
                  </div>
                </div>

                {/* Quantity + Total */}
                <div className="flex items-center justify-between md:contents">
                  <div className="inline-flex h-8 w-fit items-center border border-zinc-300 bg-white">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={item.qty <= 1}
                      onClick={() =>
                        updateItem(item.lineId, { qty: item.qty - 1 })
                      }
                      className="flex w-8 items-center justify-center
                       hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <i
                        aria-hidden
                        className="ri-subtract-line text-sm leading-none"
                      ></i>
                    </button>
                    <span
                      className="flex w-8 items-center justify-center text-[10px] md:text-xs"
                      aria-live="polite"
                    >
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={item.qty >= MAX_QTY}
                      onClick={() =>
                        updateItem(item.lineId, { qty: item.qty + 1 })
                      }
                      className="flex w-8 items-center justify-center hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <i
                        aria-hidden
                        className="ri-add-line text-sm leading-none"
                      ></i>
                    </button>
                  </div>

                  <p className="text-xs md:text-sm font-medium md:text-right">
                    {rupiah(item.price * item.qty)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          {/* Akhir */}

          {/* Club Promise */}
          <div className="mt-10">
            <p className="text-[11px] font-medium uppercase">
              The club promise
            </p>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-zinc-500 capitalize">
              <span>Easy 30-day returns</span>
              <span aria-hidden>/</span>
              <span>Considered quality</span>
              <span aria-hidden>/</span>
              <span>Worldwide delivery</span>
            </p>
          </div>
        </div>
        {/* Club Promise */}

        {/* Ringkasa */}
        <aside className="self-start">
          <div className="bg-zinc-200 p-6 md:p-8">
            <h2 className="font-anton text-2xl uppercase leading-none md:text-3xl">
              The final score.
            </h2>

            <dl className="mt-8 space-y-4 text-xs md:text-sm">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{rupiah(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <dt>Discount ({appliedCode})</dt>
                  <dd>-{rupiah(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt>Standard shipping</dt>
                <dd className={freeShipping ? "text-xs font-medium" : ""}>
                  {freeShipping ? "FREE" : rupiah(shipping)}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex items-baseline justify-between border-t border-zinc-300 pt-6">
              <span className="text-xs font-medium uppercase">Total</span>
              <span className="font-anton text-2xl leading-none md:text-3xl">
                {rupiah(total)}
              </span>
            </div>
            <p className="mt-4  text-[10px] md:text-xs text-zinc-500">
              Taxes included. No surprises at the final whistle.
            </p>

            <Link
              to="/checkout"
              className="mt-8 flex items-center justify-between bg-gray-500 px-5 py-4 text-[10px] md:text-xs font-medium uppercase text-white transition-colors hover:bg-zinc-800"
            >
              Checkout
              <i aria-hidden className="ri-arrow-right-up-line ri-lg"></i>
            </Link>
            <p className="mt-3 text-[10px] md:text-xs text-zinc-500">
              Secure checkout / Jago · Gopay · QRIS
            </p>

            <div className="mt-8">
              <button
                type="button"
                onClick={() => setShowCode((s) => !s)}
                aria-expanded={showCode}
                className="inline-flex items-center gap-1 text-[10px] md:text-xs font-medium uppercase hover:opacity-60"
              >
                Have a discount code?
                <i
                  aria-hidden
                  className={`${showCode ? "ri-subtract-line" : "ri-add-line"} text-sm leading-none`}
                ></i>
              </button>

              {showCode && (
                <form onSubmit={applyCode} className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter Code"
                    aria-label="Discount code"
                    className="min-w-0 flex-1 border border-zinc-300 bg-white px-3 py-2.5 text-[10px] md:text-xs uppercase outline-none placeholder:normal-case placeholder:text-zinc-400 focus:border-black"
                  />
                  <button
                    type="submit"
                    className="bg-black px-5 text-[10px] md:text-xs font-medium uppercase text-white transition-color hover:opacity-60"
                  >
                    Apply
                  </button>
                </form>
              )}
              {codeError && showCode && (
                <p
                  role="alert"
                  className="mt-2 text-[10px] md:text-xs text-red-600"
                >
                  {codeError}
                </p>
              )}
              {appliedCode && showCode && (
                <p className="mt-2 text-[10px] md:text-xs text-green-600">
                  Code {appliedCode} applied.
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 bg-gray-500 px-6 py-5 text-[10px] md:text-xs font-medium uppercase text-white">
            {freeShipping
              ? "You've unlocked free shipping."
              : `Add ${rupiah(FREE_SHIPPING_FROM - subtotal)} more for free shipping.`}
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Cart;
