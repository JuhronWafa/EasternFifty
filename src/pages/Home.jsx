import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

const marqueeItems = [
  "K-Boys 1950",
  "From the Eastern tip of Kediri to Persik Kediri",
  "+64294 krue",
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

      {/* Scrolling Marquee */}
      <section className="group overflow-hidden bg-gray-500 py-3 text-zinc-100">
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
      {/* Scrolling Marquee */}

      {/* Manifesto Section */}
      <section className="relative flex items-center overflow-hidden px-6 py-8 md:px-10 md:py-10 md:min-h-75 lg:min-h-125">
        <img
          src="/assets/Tiger.png"
          alt="Siluet"
          aria-hidden="true"
          className="absolute inset-0 z-0 h-full w-full object-cover object-center opacity-10"
        />

        <div className="absolute inset-0 z-0 bg-zinc-100/30"></div>

        <div className="relative z-10 grid w-full grid-cols-1 gap-4 md:grid-cols-[1fr_2fr] md:gap-10">
          <p className="text-[10px] uppercase tracking-widest text-zinc-700 md:text-xs">
            01 - Our Philosophy
          </p>

          <div>
            <h2 className="font-anton text-3xl uppercase leading-[0.95] md:text-5xl lg:text-[80px]">
              No Loud Crests. <br /> Just Pure Pride.
            </h2>
            <p className="mt-4 max-w-md text-xs text-zinc-700 md:mt-5 md:text-sm lg:text-base">
              Born from long rides to the stadium, matchday rituals, and the
              streets in between. We craft everyday uniforms for a loyalty that
              never clocks off. Rooted in Kediri +64294.
            </p>
          </div>
        </div>
      </section>
      {/* Manifesto Section */}

      {/* Shop Section */}
      <section className="px-6 pt-4 pb-8 md:px-10 md:pt-6 md:pb-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-700 md:text-xs">
              The latest drop
            </p>
            <h2 className="mt-4 font-anton text-3xl uppercase leading-none md:text-5xl lg:text-6xl">
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
          {products.slice(0, 4).map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </section>
      {/* Shop Section */}

      {/* Button HP untuk Shop Section */}
      <Link
        to="/shop"
        className="mx-auto -mt-2 mb-6 flex w-fit items-center gap-2 text-[10px] font-medium uppercase md:hidden"
      >
        Shop all products <i className="ri-arrow-right-up-line ri-lg"></i>
      </Link>
      {/* Button HP untuk Shop Section */}
    </main>
  );
}

export default Home;
