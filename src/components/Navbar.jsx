const Navbar = () => {
  return (
    <header>
      {/* Header */}
      <div className="bg-black text-white text-center py-1">
        <p className="text-xs md:text-sm font-medium md:text">
          Kandangan Boys 1950 | +64294 Krue
        </p>
      </div>
      {/* Header */}

      <div className="border-b border-black/30">
        <div className="navbar px-4 py-3 -mt-2 flex items-center justify-between">
          {/* Logo */}
          <div className="logo flex items-center gap-x-2">
            <img
              src="/assets/Macan.png"
              alt="Logo Eastern Fifty"
              className="h-8 md:h10 lg:h-12 w-auto shrink-0"
            />
            <h1 className="font-lokal md:text-4xl text-3xl lg:text-5xl font-medium leading-none -mt-1x text-black">
              Eastern Fifty
            </h1>
          </div>
          {/* Logo */}

          {/* Menu */}
          <div>
            <ul className="menu hidden md:flex items-center   md:gap-8 lg:gap-10 mr-2">
              <li>
                <a href="#" className="sm:text-lg text-base font-medium">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="sm:text-lg text-base font-medium">
                  Shop
                </a>
              </li>
              <li>
                <a href="#" className="sm:text-lg text-base font-medium">
                  Size
                </a>
              </li>
              <li>
                <a href="#" className="sm:text-lg text-base font-medium">
                  Chart
                </a>
              </li>
              <li>
                <a href="#" className="sm:text-lg text-base font-medium">
                  Tracking
                </a>
              </li>
            </ul>
          </div>
          {/* Menu */}

          {/* Tombol Ikon Menu */}
          <button className="md:hidden p-2" aria-label="buka menu">
            <i className="ri-menu-line ri-lg"></i>
          </button>
          {/* Tombol Ikon Menu */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
