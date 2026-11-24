import { useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const FREE_SHIPPING_FROM = 500000;
const SHIPPING_FEE = 20000;
const EXPRESS_FEE = 30000;
const DISCOUNT_CODES = { EASTERN10: 0.1, EASTERN20: 0.2 };

const PAYMENTS = [
  { id: "jago", title: "Jago", desc: "Transfer to our Jago account" },
  { id: "gopay", title: "Gopay", desc: "Send to our Gopay number" },
  {
    id: "qris",
    title: "QRIS",
    desc: "Scan with any banking or e-wallet app  ",
  },
];

const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const labelCls = "text-[10px] font-medium uppercase tracking-wide text-black";
const fieldCls =
  "w-full border border-zinc-300 bg-white px-4 py-2 text-[10px] md:text-xs text-black outline-none transition-colors placeholder:text-zinc-400 focus:border-black/50";

const makeOrderNumber = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `EF-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${rand}`;
};

const validate = (f) => {
  const e = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
    e.email = "Enter a valid email address.";
  if (!/^(\+62|62|0)8\d{7,11}$/.test(f.phone.replace(/[\s-]/g, "")))
    e.phone = "Enter a valid mobile number, e.g. 0812 3456 7890.";
  if (f.name.trim().length < 3) e.name = "Enter your full name.";
  if (f.address.trim().length < 10)
    e.address = "Enter your full address (street, number, RT/RW).";
  if (!f.city.trim()) e.city = "Enter your city.";
  if (!f.province.trim()) e.province = "Enter your province.";
  if (!/^\d{5}$/.test(f.postal.trim()))
    e.postal = "Postal code must be 5 digits.";
  return e;
};

const Field = ({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  inputMode,
  autoComplete,
  placeholder,
  rows,
  className = "",
}) => {
  const Tag = rows ? "textarea" : "input";
  return (
    <div className={className}>
      <label htmlFor={name} className={labelCls}>
        {label}
      </label>
      <Tag
        id={name}
        name={name}
        type={rows ? undefined : type}
        rows={rows}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`${fieldCls} mt-2 ${rows ? "resize-none" : ""} ${error ? "border-red-600" : ""}`}
      />
      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="mt-1 text-[10px] md:text-xs text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
};

const Choice = ({ selected, onClick, title, desc, right }) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onClick}
    className={`flex w-full items-center justify-between gap-4 border px-4 py-4 text-left transition-colors ${
      selected
        ? "border-gray-500 bg-gray-500 text-white"
        : "border-zinc-300 bg-white hover:border-black/50"
    }`}
  >
    <span>
      <span className="block text-xs font-semibold md:text-sm">{title}</span>
      <span
        className={`mt-1 block text-[10px] md:text-xs ${selected ? "text-zinc-200" : "text-zinc-500"}`}
      >
        {desc}
      </span>
    </span>
    {right && (
      <span className="shrink-0 text-xs font-medium md:text-sm">{right}</span>
    )}
  </button>
);

const Checkout = () => {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const { state } = useLocation();
  const placed = useRef(false);

  const [form, setForm] = useState({
    email: "",
    phone: "",
    name: "",
    address: "",
    city: "",
    province: "",
    postal: "",
    note: "",
  });
  const [delivery, setDelivery] = useState("regular");
  const [payment, setPayment] = useState("jago");
  const [errors, setErrors] = useState({});

  if (items.length === 0 && !placed.current) {
    return <Navigate to="/cart" replace />;
  }

  const discountCode = DISCOUNT_CODES[state?.discountCode]
    ? state.discountCode
    : null;

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = Math.round(subtotal * (DISCOUNT_CODES[discountCode] ?? 0));
  const freeShipping = subtotal >= FREE_SHIPPING_FROM;

  const deliveryOptions = [
    {
      id: "regular",
      title: "Regular",
      desc: "3-4 working days",
      price: freeShipping ? 0 : SHIPPING_FEE,
    },
    {
      id: "express",
      title: "Express",
      desc: "1-2 working days",
      price: EXPRESS_FEE,
    },
  ];
  const selectedDelivery = deliveryOptions.find((d) => d.id === delivery);
  const shipping = selectedDelivery.price;
  const total = subtotal - discount + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }

    const order = {
      number: makeOrderNumber(),
      createdAt: new Date().toISOString(),
      customer: {
        email: form.email.trim(),
        phone: form.phone.trim(),
        name: form.name.trim(),
      },
      address: {
        street: form.address.trim(),
        city: form.city.trim(),
        province: form.province.trim(),
        postal: form.postal.trim(),
      },
      note: form.note.trim(),
      delivery: {
        id: selectedDelivery.id,
        title: selectedDelivery.title,
        desc: selectedDelivery.desc,
      },
      payment: PAYMENTS.find((p) => p.id === payment).title,
      paymentId: payment,
      discountCode,
      items: items.map((i) => ({
        name: i.name,
        image: i.image,
        size: i.size,
        color: i.color,
        qty: i.qty,
        price: i.price,
      })),
      subtotal,
      discount,
      shipping,
      total,
    };

    try {
      localStorage.setItem("ef-last-order", JSON.stringify(order));
    } catch {}

    placed.current = true;
    clearCart();
    navigate("/order-success", { replace: true, state: { order } });
  };

  return (
    <main className="px-6 py-6 md:px-10">
      {/* Breadcrumb */}
      <nav className="text-xs uppercase tracking-widest text-zinc-500">
        <Link to="/cart" className="hover:text-black">
          <i className="ri-arrow-left-up-line ri-lg"></i> Cart
        </Link>
        <span className="mx-2">/</span>
        <span className="text-black">Checkout</span>
      </nav>
      {/* Breadcrumb */}

      {/* Header */}
      <h1 className="mt-4 font-anton text-3xl uppercase leading-none md:text-5xl lg:text-6xl">
        Almost full time.
      </h1>
      <p className="mt-2 text-xs md:text-sm text-zinc-600">
        Tell us where to send your kit.
      </p>
      {/* Header */}

      <hr className="mt-6 border-zinc-300" />

      <section className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* Form */}
        <form id="checkout-form" onSubmit={handleSubmit} noValidate>
          {/* Step 1 */}
          <p className={`${labelCls} text-zinc-500`}>01 · Contact</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field
              label="Email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@gmail.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Field
              label="WhatsApp number"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="081x xxxx xxxx"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
            />
          </div>

          <p className={`${labelCls} mt-8 text-zinc-500`}>
            02 · Shipping address
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field
              className="sm:col-span-2"
              label="Full name"
              name="name"
              autoComplete="name"
              placeholder="Receiver name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />
            <Field
              className="sm:col-span-2"
              label="Address"
              name="address"
              rows={3}
              autoComplete="street-address"
              placeholder="Street, number, RT/RT, landmark"
              value={form.address}
              onChange={handleChange}
              error={errors.address}
            />
            <Field
              label="City"
              name="city"
              autoComplete="address-level2"
              value={form.city}
              onChange={handleChange}
              error={errors.city}
            />
            <Field
              label="Province"
              name="province"
              autoComplete="address-level3"
              value={form.province}
              onChange={handleChange}
              error={errors.province}
            />
            <Field
              label="Postal code"
              name="postal"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="64294"
              value={form.postal}
              onChange={handleChange}
              error={errors.postal}
            />
            <Field
              className="sm:col-span-2"
              label="Order note (optional)"
              name="note"
              rows={2}
              placeholder="Anyting we should know?"
              value={form.note}
              onChange={handleChange}
            />
          </div>

          {/* Step 3 */}
          <p className={`${labelCls} mt-8 text-zinc-500`}>03 · Delivery</p>
          <div
            role="radiogroup"
            aria-label="Delivery method"
            className="mt-3 grid gap-2"
          >
            {deliveryOptions.map((d) => (
              <Choice
                key={d.id}
                selected={delivery === d.id}
                onClick={() => setDelivery(d.id)}
                title={d.title}
                desc={d.desc}
                right={d.price === 0 ? "FREE" : rupiah(d.price)}
              />
            ))}
          </div>

          {/* Step 4 */}
          <p className={`${labelCls} mt-8 text-zinc-500`}>04 · Payment</p>
          <div
            role="radiogroup"
            aria-label="Payment-method"
            className="mt-3 grid gap-2"
          >
            {PAYMENTS.map((p) => (
              <Choice
                key={p.id}
                selected={payment === p.id}
                onClick={() => setPayment(p.id)}
                title={p.title}
                desc={p.desc}
              />
            ))}
          </div>
        </form>
      </section>
    </main>
  );
};
export default Checkout;
