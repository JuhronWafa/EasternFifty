import { useState } from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  { label: "Size", path: "/size" },
  { label: "Cart", path: "/cart" },
  { label: "Tracking", path: "/tracking" },
  { label: "Account", path: "/account", icon: "ri-user-line" },
];

// Class untuk link: aktif = garis bawah
const linkClass = ({ isActive }) =>
  `flex items-center gap-1 text-base uppercase tracking-wide ${isActive ? "text-black" : "text-zinc-700"}`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header>
      {/* Header */}
      <div className="bg-black text-white text-center py-1">
        <p className="font-montserrat text-xs md:text-sm font-medium">
          Kandangan Boys 1950 | +64294 Krue
        </p>
      </div>
      {/* Header */}

      {/* Navbar */}
      <div
        className={`relative border-b transition-colors duration-300 md:border-[rgba(0,0,0,0.1)] ${isOpen ? "border-transparent" : "border-[rgba(0,0,0,0.1)]"}`}
      >
        {/* Menu Dekstop */}
        <div className="navbar px-4 py-3 -mt-1 flex items-center justify-between">
          {/* Logo */}
          <div className="logo flex items-center gap-x-2">
            <img
              src="/assets/Macan.png"
              alt="Logo Eastern Fifty"
              className="h-8 md:h-10 lg:h-12 w-auto shrink-0"
            />
            <h1 className="font-lokal text-3xl md:text-4xl lg:text-5xl font-medium leading-none text-black">
              Eastern Fifty
            </h1>
            <sup className="-ml-2 align-top text-xs md:text-sm lg:text-base leading-none">
              ®
            </sup>
          </div>
          {/* Logo */}

          <ul className="menu hidden md:flex items-center md:gap-8 lg:gap-10 mr-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  className={(state) =>
                    `${linkClass(state)} md:text-xs lg:text-sm text-base font-medium`
                  }
                >
                  {item.icon && <i className={`${item.icon} ri-lg`}></i>}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Tombol Ikon Menu */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "tutup menu" : "buka menu"}
          >
            <i
              className={`${isOpen ? "ri-close-line" : "ri-menu-line"} ri-lg`}
            ></i>
          </button>
          {/* Tombol Ikon Menu */}
        </div>
        {/* Menu Dekstop*/}

        {/* Sidebar */}
        <ul
          className={`font-medium md:hidden absolute inset-x-0 top-full z-50 flex flex-col items-center gap-8 bg-zinc-100 pb-10 pt-4 shadow-lg transition-[transform,opacity] duration-300 ease-in-out ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0 pointer-events-none"}`}
        >
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/"}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-1 text-sm uppercase tracking-wide ${isActive ? "text-black" : "text-zinc-700"}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        {/* Sidebar */}
      </div>
      {/* Navbar */}
    </header>
  );
};

export default Navbar;
