import { Link } from "react-router-dom";

const marqueeItems = [
  "From Eastern Tip Of Kediri To Persik Kediri",
  "K-Boys 1950",
  "+64294 krue",
];

function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="grid grid-cols-1 md:min-h-[580px] md:grid-cols-[2fr_3fr]">
        {/* Panel Hitam - Kiri */}
        <div className="flex  flex-col justify-between bg-black px-6 py-8 text-zinc-100 md:px-10">
          <p className="text-[9px] uppercase tracking-widest md:text-[10px] lg:text-xs">
            Drop 01 / Rooted In 1950
          </p>

          <div className="my-10 md:my-0">
            <h2 className="font-anton text-[65px] uppercase leading-[1] md:text-[66px] lg:text-[105px]">
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
          <p className="text-[10px] uppercase tracking-wider text-zinc-400">
            From East Kediri | +64294
          </p>
        </div>
      </section>

      <section className="flex items-center gap-8 overflow-x-hidden whitespace-nowrap bg-gray-500 px-6 py-6 text-zinc-100">
        {marqueeItems.map((text) => (
          <div key={text} className="flex items-center gap-8">
            <span className="font-anton text-lg uppercase">{text}</span>
            <span aria-hidden="true">✦</span>
          </div>
        ))}
      </section>
    </main>
  );
}

export default Home;
