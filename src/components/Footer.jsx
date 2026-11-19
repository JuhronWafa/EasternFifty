import { href, Link, useLocation } from "react-router-dom";

const HIDDEN_ON = ["/account"];

const columns = [
  {
    title: "Explore",
    links: [
      { label: "All Items", path: "/shop" },
      { label: "Size Guide", path: "/size" },
      { label: "Cart", path: "/cart" },
    ],
  },
  {
    title: "Customer care",
    links: [
      { label: "Tracking", path: "/tracking" },
      { label: "Shipping & returns", path: "/shipping" },
      { label: "FAQs", path: "/faqs" },
    ],
  },
];

const socials = [
  { label: "Instagram", href: "https://instagram.com/easternfifty" },
  { label: "Twitter", href: "https://twitter.com/easternfifty" },
  { label: "TikTok", href: "https://tiktok.com/easternfifty" },
];

const legal = [
  { label: "Privacy", path: "/privacy" },
  { label: "Terms", path: "/terms" },
  { label: "Cookies", path: "/cookies" },
];

const headingCls =
  "text-[9px] md:text-[11px] font-medium uppercase tracking-wide text-zinc-100";
const linkCls =
  "text-[10px] md:text-xs text-zinc-100 font-light transition-opacity hover:opacity-60";

const Footer = () => {
  const { pathname } = useLocation();

  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;
  return (
    <footer className="mt-12 bg-black text-zinc-100">
      <div className="grid grid-cols-1 gap-12 px-6 pb-16 pt-14 md:grid-cols-[minmax(0,2.4fr)_1fr_1fr_1fr] md:px-12">
        {/* Logo dan Nama Brand */}
        <div>
          <div className="flex items-center gap-x-2">
            <img
              src="/assets/Macan.png"
              alt="Logo Eastern Fifty"
              className=" h-6 md:h-8 lg:h-10 w-auto shrink-0"
            />
            <h2 className="font-lokal text-xl md:text-2xl lg:text-3xl font-medium leading-none">
              Eastern Fifty
            </h2>
          </div>
          <p className="mt-4 max-w-xs text-[10px] text-zinc-400 md:text-xs">
            No loud crests. Just pure pride. Everyday uniforms from the eastern
            tip of Kediri.
          </p>
        </div>
        {/* Logo dan Nama Brand */}

        {/* Links Columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <p className={headingCls}>{col.title}</p>
            <ul className="mt-4 space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.path} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {/* Links Columns */}
        <div>
          <p className={headingCls}>Follow the culture</p>
          <ul className="mt-4 space-y-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="norferrer"
                  className={`${linkCls} inline-flex items-center gap-1.5`}
                >
                  {s.label}
                  {/* <i className="ri-arrow-up-right-line ri-lg"></i> */}
                  <span aria-hidden className="text-xs">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        {/* Social */}
      </div>

      {/* Bottom */}
      <div className="mx-6 border-t border-zinc-700 md:mx-12" />
      <div className="flex flex-col gap-3 px-6 py-5 text-[11px] uppercase text-zinc-100 md:flex-row md:items-center md:justify-between md:px-12">
        <p>© {new Date().getFullYear()} Eastern Fifty. All rights reserved.</p>

        <ul className="flex gap-4">
          {legal.map((l) => (
            <li key={l.label}>
              <Link to={l.path} className="hover:opacity-60">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-zinc-100">Wp &nbsp;/&nbsp; 1'15</p>
      </div>

      {/* Bottom */}
    </footer>
  );
};

export default Footer;
