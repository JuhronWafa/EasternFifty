import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const STORAGE_KEY = "ef-account";

const DEFAULT_ACCOUNT = {
  profile: {
    name: "Galen Ray",
    email: "alex.morgan@email.com",
    phone: "0812 3456 7890",
    since: "2026-03-01",
  },
  addresses: [
    {
      id: 1,
      name: "Alex Morgan",
      phone: "0812 3456 7890",
      street: "Jl. Contoh No. 12, RT 01/RW 02",
      city: "Kediri",
      province: "Jawa Timur",
      postal: "64100",
      isDefault: true,
    },
  ],
};

const loadAccount = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? DEFAULT_ACCOUNT;
  } catch {
    return DEFAULT_ACCOUNT;
  }
};

const loadOrders = () => {
  try {
    const order = JSON.parse(localStorage.getItem("ef-last-order"));
    return order ? [order] : [];
  } catch {
    return [];
  }
};

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "My orders" },
  { id: "addresses", label: "Saved addresses" },
  { id: "details", label: "Account details" },
];

const STATUS_LABEL = {
  pending_payment: "Awaiting payment",
  paid: "Paid",
  processing: "Processing",
  shipped: "In transit",
  completed: "Delivered",
  cancelled: "Cancelled",
};

const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const fmtDate = (n) =>
  new Date(d).toLocaleDateString("en_GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const labelCls =
  "text-[10px] font-medium uppercase tracking-wide text-zinc-500";
const fieldCls =
  "mt-2 w-full border border-zinc-300 bg-white px-4 py-3 text-xs md:text-sm text-black outline-none transition-colors placeholder:text-zinc-400 focus:border-black";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(\+62|62|0)8\d{7,11}$/;
const cleanPhone = (p) => p.replace(/[\s-]/g, "");

// Komponen Kecil
const Field = ({ label, name, error, rows, className = "", ...props }) => {
  const Tag = rows ? "textarea" : "input";
  return (
    <div className={className}>
      <label htmlFor={name} className={labelCls}>
        {label}
      </label>
      <Tag
        id={name}
        name={name}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`${fieldCls} ${rows ? "resize-none" : ""} ${error ? "border-red-600" : ""}`}
        {...props}
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

export default Account;
