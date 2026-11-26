import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { WHATSAPP_NUMBER } from "../data/payment";

const labelCls =
  "text-[10px] font-medium uppercase tracking-wide text-zinc-400";
const fieldCls =
  "mt-2 w-full bg-white px-4 py-3 text-xs md:text-sm text-black outline-none placeholder:text-zinc-400";

// Urutan Status, ID disamakan dengan status Database
const STEPS = [
  {
    id: "pending_payment",
    title: "Awaiting payment",
    desc: "We are waiting for your payment.",
    badge: "Awaiting payment",
    headline: "One last step.",
  },
  {
    id: "paid",
    title: "Payment confirmed",
    desc: "Your payment has been verified.",
    badge: "Paid",
    headline: "Payment confirmed.",
  },
  {
    id: "processing",
    title: "Packing your kit",
    desc: "Your order is being prepared.",
    badge: "Processing",
    headline: "Packing your kit.",
  },
  {
    id: "shipped",
    title: "On the way",
    desc: "Your order has been handed to the courier.",
    badge: "In transit",
    headline: "On its way to you.",
  },
  {
    id: "completed",
    title: "Delivered",
    desc: "Nearly time to wear it out.",
    badge: "Delivered",
    headline: "Wear it well.",
  },
];

const DELIVERY_DAYS = { regular: 5, express: 2 };

/* ---------- helper tanggal ---------- */
const shortDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

const shortDateTime = (d) =>
  `${shortDate(d)}, ${new Date(d).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

const longDate = (d) =>
  `${new Date(d).toLocaleDateString("en-GB", { weekday: "long" })}, ${shortDate(d)}`;

const addWorkingDays = (date, days) => {
  const d = new Date(date);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added += 1;
  }
  return d;
};

// Sementara pakai localStorage (pesanan terakhir di browser ini)
// Nanti ganti dengan request ke backend, seperti : GET /orders/track?number=...&email=...
const findOrder = (number, email) => {
  try {
    const order = JSON.parse(localStorage.getItem("ef-last-order"));
    if (!order) return null;
    const sameNumber =
      order.number.toLowerCase() === number.trim().toLowerCase();
    const sameEmail =
      order.customer.email.toLowerCase() === email.trim().toLowerCase();
    return sameNumber && sameEmail ? order : null;
  } catch {
    return null;
  }
};

//  Waktu kejadian tiap order. order.history = [{ status, at }]
const historyAt = (order, id) =>
  order.history?.find((h) => h.status === id)?.at ?? null;

const Tracking = () => {
  const [params] = useSearchParams();
  const [number, setNumber] = useState(params.get("order") ?? "");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setOrder(null);

    if (!number.trim() || !email.trim()) {
      setError("Enter your order number and email.");
      return;
    }

    const found = findOrder(number, email);
    if (!found) {
      setError(
        "We couldn't find an order with those details. Check your order number and email.",
      );
      return;
    }
    setError("");
    setOrder(found);
  };

  // Turunan data hasil
  const status = order?.status ?? "pending_payment";
  const cancelled = status === "cancelled";
  const current = Math.max(
    0,
    STEPS.findIndex((s) => s.id === status),
  );
  const step = STEPS[current];

  let estimate = null;
  let deliveredAt = null;
  if (order && !cancelled) {
    deliveredAt = historyAt(order, "completed");
    const base = historyAt(order, "shipped") ?? order.createdAt;
    estimate = addWorkingDays(base, DELIVERY_DAYS[order.delivery.id] ?? 5);
  }

  const stampFor = (s) => {
    const at =
      historyAt(order, s.id) ??
      (s.id === "pending_payment" ? order.createdAt : null);
    if (at) return shortDateTime(at);
    if (s.id === "completed" && estimate)
      return `Estimated ${shortDate(estimate)}`;
    return "";
  };

  return (
    <main className="px-6 py-6 md:px-10">
      {/* Breadcrumb */}
      <nav className="text-xs uppercase tracking-widest text-zinc-500">
        <Link to="/" className="hover:text-black">
          <i className="ri-arrow-right-up-line ri-lg"></i> Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-black">Tracking</span>
      </nav>
      {/* Breadcrumb */}

      {/* Header */}
      <h1 className="mt-4 font-anton text-3xl uppercase leading-none md:text-5xl lg:text-6xl">
        Follow your kit.
      </h1>
      <p className="mt-2 text-xs md:text-sm text-zinc-600">
        From our club to your doorstep. Every step of the way.
      </p>
      {/* Header */}

      <hr className="mt-6 border-zinc-300" />

      <section className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-14">
        {/* Form (kartu hitam) */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="self-start bg-black p-6 text-white md:p-8"
        >
          <h2 className="font-anton text-2xl uppercase leading-none md:text-3xl">
            Where&apos;s my order?
          </h2>
          <p className="mt-4 text-xs md:text-sm text-zinc-400">
            Enter your details to see the latest update.
          </p>

          <div className="mt-8">
            <label htmlFor="order" className={labelCls}>
              Order number
            </label>
            <input
              id="order"
              type="text"
              placeholder="EF-20261126-12345"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className={`${fieldCls} uppercase placeholder:normal-case`}
            />
          </div>

          <div className="mt-5">
            <label htmlFor="email" className={labelCls}>
              Email address
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldCls}
            />
          </div>

          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-between bg-gray-500 px-5 py-4 text-[10px] font-medium uppercase text-white transition-colors hover:bg-gray-400 md:text-xs"
          >
            Track order{" "}
            <i aria-hidden className="ri-arrow-right-up-line ri-lg"></i>
          </button>

          {error ? (
            <p
              role="alert"
              className="mt-4 text-[10px] md:text-xs text-red-400"
            >
              {error}
            </p>
          ) : (
            <p className="mt-4 max-w-xs text-[10px] md:text-xs text-zinc-400">
              Your order number is shown after checkout. It starts with EF-.
            </p>
          )}

          <hr className="mt-8 border border-zinc-800" />

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1 text-[10px] font-medium uppercase hover:opacity-60 md:text-xs "
          >
            Need an assist? Contact us{" "}
            <i aria-hidden className="ri-arrow-right-up-line ri-lg"></i>
          </a>
        </form>
        {/* Form */}

        {/* Hasil */}
        {order ? (
          <div>
            <div className="flex items-start justify-between gap-4">
              <p className="text-[10px] font-semibold uppercase md:text-xs">
                Order #{order.number}
              </p>
              <span className="shrink-0 bg-gray-500 px-3 py-1.5 text-[10px] uppercase text-white">
                {cancelled ? "Cancelled" : step.badge}
              </span>
            </div>

            <h2 className="mt-6 font-anton text-3xl uppercase leading-none md:text-5xl">
              {cancelled ? "Order cancelled." : step.headline}
            </h2>

            {/* Estimasi Tiba */}
            {!cancelled && (deliveredAt || estimate) && (
              <div className="mt-8">
                <p className="text-xs md:text-sm text-zinc-500">
                  {deliveredAt ? "Delivered on" : "Estimated delivery"}
                </p>
                <p className="mt-2 font-anton text-2xl uppercase leading-none md:text-4xl">
                  {longDate(deliveredAt ?? estimate)}
                </p>
              </div>
            )}

            {/* Kurir dan Resi */}
            <p className="mt-6 text-xs md:text-sm text-zinc-500">
              {order.trackingNumber
                ? `${order.courier ?? "Courier"} / ${order.trackingNumber}`
                : "Courier details will appear here once your order ships."}
            </p>

            <hr className="mt-8 border-zinc-300" />

            {/* Timeline */}
            {cancelled ? (
              <p className="mt-8 max-w-md text-xs md:text-sm text-zinc-600">
                This order was cancelled. If you think this is a mistake,
                contact the club.
              </p>
            ) : (
              <ol className="mt-8">
                {STEPS.map((s, i) => {
                  const done = i < current;
                  const active = i === current;
                  const stamp = stampFor(s);
                  return (
                    <li
                      key={s.id}
                      className="relative flex gap-4 pb-8 last:pb-0"
                    >
                      {i < STEPS.length - 1 && (
                        <span
                          aria-hidden
                          className={`absolute bottom-0 left-2.75 top-6 w-px ${done ? "bg-black" : "bg-zinc-300"}`}
                        />
                      )}
                      <span
                        className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center text-[10px] font-semibold ${done ? "bg-black text-white" : active ? "bg-gray-500 text-white" : "bg-zinc-200 text-zinc-500"}`}
                      >
                        {done ? (
                          <i
                            aria-hidden
                            className="ri-check-line text-xs leading-none"
                          ></i>
                        ) : (
                          i + 1
                        )}
                      </span>

                      <div className="min-w-0 flex-1 sm:flex sm:justify-between sm:gap-4">
                        <div>
                          <p
                            className={`text-xs font-semibold md:text-sm ${!done && !active ? "text-zinc-400" : ""}`}
                          >
                            {s.title}
                          </p>
                          <p className="mt-1 text-[10px] md:text-xs text-zinc-500">
                            {s.desc}
                          </p>
                          {stamp && (
                            <p className="mt-1 text-[10px] text-zinc-500 sm:hidden">
                              {stamp}
                            </p>
                          )}

                          {/* Menunggu Pembayaran: Arahkan ke Intruksi Bayar */}
                          {active && s.id == "pending_payment" && (
                            <Link
                              to="/order-success"
                              state={{ order }}
                              className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium uppercase hover:opacity-60 md:text-xs"
                            >
                              See payment details{" "}
                              <i
                                aria-hidden
                                className="ri-arrow-right-up-line text-sm leading-none"
                              ></i>
                            </Link>
                          )}
                        </div>
                        {stamp && (
                          <p className="hidden shrink-0 text-[10px] text-zinc-500 sm:block md:text-xs">
                            {stamp}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}

            {/* Alamat Tujuan */}
            <div className="mt-10 bg-zinc-200 px-5 py-4">
              <p className="text-[10px] uppercase tracking-wide text-zinc-500">
                Delivering to
              </p>
              <p className="mt-2 text-xs md:text-sm">{order.customer.name}</p>
            </div>
          </div>
        ) : (
          <div className="flex min-h-65 items-center justify-center p-8 text-center ">
            <div>
              <i
                aria-hidden
                className="ri-truck-line text-5xl leading-none text-zinc-300"
              ></i>
              <p className="mt-4 font-anton text-2xl uppercase leading-none md:text-3xl">
                Nothing to track yet.
              </p>
              <p className="mt-3 text-xs md:text-sm text-zinc-600">
                Enter your order number and email to see the latest update
              </p>
            </div>
          </div>
        )}
        {/* Hasil */}
      </section>
    </main>
  );
};

export default Tracking;
