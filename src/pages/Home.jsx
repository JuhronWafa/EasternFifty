import { Link } from "react-router-dom";

const marqueeItems = [
  "K-Boys 1950",
  "From the Eastern tip of Kediri to Persik Kediri",
  "+64294 krue",
];

const products = [
  {
    id: 1,
    name: "Terrace stripe jersey",
    price: "£68",
    variant: "Black / Ecru",
    badge: "Bestseller",
    image: "/assets/products/Jersey.png",
    colors: ["#111111", "#ece8dc"],
  },
  {
    id: 2,
    name: "Away days track jacket",
    price: "£110",
    variant: "Olive / Ecru",
    badge: "New",
    image: "/assets/products/TrackJacket.png",
    colors: ["#6b7a5a", "#111111"],
  },
  {
    id: 3,
    name: "Club heavyweight tee",
    price: "£42",
    variant: "Chalk / Black",
    badge: "New",
    image: "/assets/products/Tee.png",
    colors: ["#ece8dc", "#111111"],
  },
  {
    id: 4,
    name: "90-minute track pant",
    price: "£85",
    variant: "Black / Ecru",
    image: "/assets/products/TrackPant.png",
    colors: ["#111111", "#6b7a5a"],
  },
];

function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="grid grid-cols-1 md:min-h-145 bg-black lg:grid-cols-[2fr_3fr]">
        {/* Panel Hitam - Kiri */}
        <div className="flex  flex-col justify-between bg-black px-6 py-8 text-zinc-100 md:px-10">
          <p className="text-[9px] uppercase tracking-widest md:text-[10px] lg:text-xs md:mb-5">
            Drop 01 / Rooted In 1950
          </p>

          <div className="my-10 md:my-0">
            <h2 className="font-anton text-[65px] uppercase leading-none md:text-[66px] lg:text-[105px]">
              BUILT FROM <br /> THE EAST.
            </h2>
            <p className=" font-lokal mt-4 text-2xl sm:text-3xl lg:text-4xl font-medium text-gray-500">
              A way of life.
            </p>
            <p className="mt-6 max-w-xs text-xs md:text-sm lg:text-base text-zinc-300">
              Where the eastern border of Kediri meets the 1950 legacy. No loud
              logos. Just pure terrace heritage stitched for the everyday
              streets.
            </p>

            <Link
              to="/shop"
              className="mt-8 flex w-fit items-center gap-5 bg-zinc-100 px-5 py-3 text-[10px] md:text-xs font-semibold uppercase text-black transition-colors hover:bg-gray-400"
            >
              Shop Collection
              <i className="ri-arrow-right-up-line ri-lg"></i>
            </Link>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-zinc-400 -mt-4 md:mt-6">
            From East Kediri | +64294
          </p>
        </div>
        {/* Panel Hitam - Kiri */}

        {/* Foto - Kanan */}
        <div className="relative aspect-4/3 bg-black md:aspect-16/10 lg:aspect-auto overflow-hidden">
          <img
            src="/assets/Hero.png"
            alt="Skena Football"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 left-0 hidden w-16 bg-linear-to-r from-black to-transparent lg:block"></div>
        </div>
        {/* Foto - Kanan */}
      </section>
      {/* Hero Section */}

      {/* Footer Home */}
      <section className="group overflow-hidden bg-gray-500 py-3 text-zinc-100">
        {/* py dari 6 menjadi 3 */}
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[0, 1].map((half) => (
            <div
              key={half}
              aria-hidden={half === 1}
              className="flex shrink-0 items-center"
            >
              {[...marqueeItems, ...marqueeItems].map((text, i) => (
                <div key={i} className="flex items-center gap-8 px-4">
                  <span className="font-anton text-xs md:text-lg whitespace-nowrap uppercase tracking-wider">
                    {text}
                  </span>
                  <span aria-hidden="true">✦</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      {/* Footer Home */}

      {/* Shop Section */}
      <section className="px-6 py-12 md:px-10 md:py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 md:text-xs">
              The latest drop
            </p>
            <h2 className="mt-4 font-anton text-3xl uppercase leading-none md:text-6xl">
              The new rotation.
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Everyday staples. Matchday mentality.
            </p>
          </div>
          <Link
            to="/shop"
            className="hidden items-center gap-2 text-xs font-medium uppercase md:flex"
          >
            Shop all products <i className="ri-arrow-right-up-line ri-lg"></i>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.map((item) => (
            <article key={item.id}>
              <div className="relative aspect-4/5 overflow-hidden bg-stone-200">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-contain"
                />
                {item.badge && (
                  <span className="absolute left-3 top-3 bg-zinc-100 px-3 py-1.5 text-[10px] uppercase">
                    {item.badge}
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-start justify-between gap-2 text-sm">
                <h3 className="font-medium">{item.name}</h3>
                <span>{item.price}</span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">{item.variant}</p>

              <div className="mt-3 flex gap-1.5">
                {item.colors.map((color) => (
                  <span
                    key={color}
                    className="h-2.5 w-2.5"
                    style={{ backgroundColor: color }}
                  ></span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      {/* Shop Section */}
    </main>
  );
}

export default Home;
