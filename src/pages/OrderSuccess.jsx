import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { PAYMENT_METHODS, WHATSAPP_NUMBER } from "../data/payment";

const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const labelCls =
  "text-[10px] font-medium uppercase tracking-wide text-zinc-500";

const loadOrder = (state) => {
  if (state?.order) return state.order;
  try {
    return JSON.parse(localStorage.getItem("ef-last-order"));
  } catch {
    return null;
  }
};

const Info = ({ label, children }) => (
  <div>
    <dt className={labelCls}>{label}</dt>
    <dd className="mt-2 text-xs leading-relaxed md:text-sm">{children}</dd>
  </div>
);

const CopyButton = ({ value, label }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      className="inline-flex shrink-0 items-center gap-1 text-[10px] font-medium uppercase text-zinc-300 transition-colors hover:text-white md:text-xs"
    >
      <i
        aria-hidden
        className={`${copied ? "ri-check-line" : "ri-file-copy-line"} text-sm leading-none`}
      ></i>{" "}
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

const PaymentRow = ({ label, children, copy }) => (
  <div className="flex items-center justify-between gap-4 border-b border-zinc-800 py-3 last:border-b-0">
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-1 break-all text-sm font-medium md:text-base">
        {children}
      </p>
    </div>
    {copy && <CopyButton value={copy} label={label} />}
  </div>
);

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = loadOrder(state);

  if (!order) return <Navigate to="/shop" replace />;

  const method = PAYMENT_METHODS[order.paymentId];
  const fullName = order.customer.name;
  const date = new Date(order.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const waText = [
    "Halo Eastern Fifty, saya sudah melakukan pembayaran.",
    "",
    `Order : ${order.number}`,
    `Metode : ${order.payment}`,
    `Total : ${rupiah(order.total)}`,
    "",
    "Pesanan :",
    ...order.items.map((i) => {
      const detail = [i.size !== "-" ? i.size : null, i.color]
        .filter(Boolean)
        .join(", ");
      return `- ${i.name}${detail ? ` (${detail})` : ""} x${i.qty}`;
    }),
    "",
    "Kirim ke :",
    order.customer.name,
    order.address.street,
    `${order.address.city}, ${order.address.province} ${order.address.postal}`,
    order.customer.phone,
    "",
    "Bukti pembayaran saya lampirkan di chat ini.",
  ].join("\n");
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

  return (
    <main className="px-6 py-6 md:px-10">
      {/* Breadcrumb */}
      <nav className="text-xs uppercase tracking-widest text-zinc-500">
        <Link to="/" className="hover:text-black">
          <i className="ri-arrow-left-up-line ri-lg"></i> Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-black">Order success</span>
      </nav>
      {/* Breadcrumb */}

      {/* Header */}
      <h1 className="mt-4 font-anton text-3xl uppercase leading-none md:text-5xl lg:text-6xl">
        Match secured.
      </h1>
      <p className="mt-2 text-xs md:text-sm text-zinc-600">
        Thanks, {order.customer.name}. Your order {order.number} is in.
      </p>
      {/* Header */}

      <hr className="mt-6 border-zinc-300" />

      <section className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div>
          {/* Intruksi Pembayaran */}
          <div className="bg-black p-6 text-white md:p-8">
            <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">
              Status · Awaiting payment
            </p>
            <h2 className="mt-3 font-anton text-2xl uppercase leading-none md:text-3xl">
              One last step.
            </h2>
            <p className="mt-4 max-w-md text-xs md:text-sm text-zinc-400">
              Pay {rupiah(order.total)} via {order.payment}, then send your
              proof of payment on WhatsaApp so we can confirm your order.
            </p>

            {method && (
              <div className="mt-6 border border-zinc-800 px-4 py-2">
                {method.type === "bank" && (
                  <>
                    <PaymentRow label="bank">{method.bank}</PaymentRow>
                    <PaymentRow
                      label="Account number"
                      copy={method.number.replace(/\s/g, "")}
                    >
                      {method.number}
                    </PaymentRow>
                    <PaymentRow label="Account name">
                      {method.holder}
                    </PaymentRow>
                  </>
                )}

                {method.type === "ewallet" && (
                  <>
                    <PaymentRow
                      label="Gopay number"
                      copy={method.number.replace(/\s/g, "")}
                    >
                      {method.number}
                    </PaymentRow>
                    <PaymentRow label="Account name">
                      {method.holder}
                    </PaymentRow>
                  </>
                )}

                {method.type === "qris" && (
                  <div className="py-4 text-center">
                    <img
                      src={method.image}
                      alt="QRIS payment code"
                      className="mx-auto w-56 max-w-full bg-white p-3"
                    />
                    <p className="mt-3 text-[10px] md:text-xs text-zinc-400">
                      Scan with any banking or e-wallet app.
                    </p>
                    <a
                      href={method.image}
                      download="QRIS-Eastern-Fifty.png"
                      className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium uppercase text-zinc-300 hover:text-white md:text-xs"
                    >
                      <i
                        aria-hidden
                        className="ri-download-line text-sm leading-none"
                      ></i>{" "}
                      Save QR image
                    </a>
                  </div>
                )}

                <PaymentRow label="Amount to pay" copy={String(order.total)}>
                  {rupiah(order.total)}
                </PaymentRow>
              </div>
            )}

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-between bg-white px-5 py-4 text-[10px] font-medium uppercase text-black transition-opacity hover:opacity-80 md:text-xs"
            >
              I have paid · Send proof on WhatsApp{" "}
              <i aria-hidden className="ri-whatsapp-line ri-lg"></i>
            </a>
          </div>

          {/* Detail Pesanan */}
          <dl className="mt-10 grid gap-6 sm:grid-cols-2">
            <Info label="Order number">{order.number}</Info>
            <Info label="Date">{date}</Info>
            <Info label="Ship to">
              {order.customer.name}
              <br />
              {order.address.street}
              <br />
              {order.address.city}, {order.address.province}{" "}
              {order.address.postal}
            </Info>
            <Info label="Contact">
              {order.customer.email}
              <br />
              {order.customer.phone}
            </Info>
            <Info label="Delivery">
              {order.delivery.title} · {order.delivery.desc}
            </Info>
            <Info label="Payment">{order.payment}</Info>
            {order.note && (
              <div className="sm:col-span-2">
                <Info label="Order note">{order.note}</Info>
              </div>
            )}
          </dl>
          
        </div>
      </section>
    </main>
  );
};

export default OrderSuccess;
