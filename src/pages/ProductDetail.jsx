import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { products } from "../data/products";

function ProductDetail() {
  const { id } = useParams();
  const item = products.find((p) => String(p.id) === id);

  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [openMaterial, setOpenMaterial] = useState(false);
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });

  const handleMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ active: true, x, y });
  };

  const CATEGORY_DESCRIPTIONS = {
    Jerseys:
      "Classic collar cut inspired by retro terrace wear. Sharp enough for the streets, comfortable for long matchday rides.",
    Jackets:
      "Built to handle cold night rides from the eastern border to the stadium. Durable outer shell with subtle 1950 details.",
    "T-Shirts":
      "Crafted from heavyweight cotton for daily wear. Clean terrace silhouette carrying the pride of the East.",
    Pants:
      "Relaxed track cut made for the walk to the stadium and everything after the final whistle. Easy to wear, hard to outgrow.",
    Hoodies:
      "Heavyweight fleece for chilly matchday mornings. A quiet silhouette with the weight of the 1950 legacy.",
    Shorts:
      "Lightweight and made to move, from training days to warm evenings on the terrace. No loud logos, just pure pride.",
    Accessories:
      "The finishing touch for every matchday. Small details stitched with the spirit of the East.",
  };

  if (!item) {
    return (
      <main className="px-6 py-20 text-center md:px-10">
        <p className="text-sm text-zinc-500">Produk tidak ditemukan.</p>
        <Link
          to="/shop"
          className="mt-4 inline-block text-xs font-medium uppercase"
        >
          <i className="ri-arrow-left-up-line ri-lg"></i> Kembali ke Shop
        </Link>
      </main>
    );
  }

  const needsSize = item.sizes?.length > 0;

  const validate = () => {
    if (needsSize && !size) {
      setError("Pilih ukuran dulu.");
      return false;
    }
    setError("");
    return true;
  };

  const handleAddToCart = () => {
    if (!validate()) return;
    console.log("Add to cart:", { id: item.id, size, qty });
  };

  const handleBuyNow = () => {
    if (!validate()) return;
    console.log("Buy now:", { id: item.id, size, qty });
  };

  return (
    <main className="px-6 py-6 md:px-10">
      {/* Header */}
      <nav className="text-xs uppercase tracking-widest text-zinc-500">
        <Link to="/shop" className="hover:text-black">
          <i className="ri-arrow-left-up-line ri-lg"></i> Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-black">Product Detail</span>
      </nav>
      {/* Header */}

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[0.7fr_1fr] lg:gap-16">
        {/* Gambar */}
        <div
          className="group relative aspect-4/5 overflow-hidden bg-stone-200 lg:cursor-zoom-in"
          onMouseMove={handleMove}
          onMouseLeave={() => setZoom({ active: false, x: 50, y: 50 })}
        >
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-contain transition-transform duration-200 ease-out"
            style={{
              transform: zoom.active ? "scale(1.5)" : "scale(1)",
              transformOrigin: `${zoom.x}% ${zoom.y}%`,
            }}
          />
          {item.badge && (
            <span className="absolute left-3 top-3 bg-zinc-100 px-3 py-1.5 text-[10px] uppercase">
              {item.badge}
            </span>
          )}
        </div>
        {/* Gambar */}

        {/* Info */}
        <div>
          <h1 className="font-anton text-3xl uppercase leading-tight md:text-5xl lg:text-6xl">
            {item.name}
          </h1>
          <p className="mt-2 text-xs md:text-sm uppercase text-zinc-600">
            {item.category} in {item.variant}
          </p>
          <p className="mt-6 text-xl md:text-2xl lg:text-3xl text-black">
            {item.price}
          </p>

          {/* Product Detail */}
          <div className="mt-8">
            <h2 className="text-xs md:text-sm font-semibold uppercase tracking-wide text-black">
              Product details
            </h2>
            <p className="mt-3 text-xs md:text-sm leading-relaxed text-zinc-600">
              {item.description ??
                CATEGORY_DESCRIPTIONS[item.category] ??
                "Everyday staples, matchday mentality."}
            </p>
          </div>
          {/* Product Detail */}

          {/* Material */}
          <div className="mt-6 border-y border-zinc-200">
            <button
              type="button"
              onClick={() => setOpenMaterial(!openMaterial)}
              className="flex w-full items-center justify-between py-4 text-xs md:text-sm font-semibold uppercase"
            >
              Material
              <i
                className={`ri-arrow-down-s-line transition-transform duration-300 ${openMaterial ? "rotate-180" : ""}`}
              ></i>
            </button>

            <div
              aria-hidden={!openMaterial}
              className={`grid transition-all duration-300 ease-in-out ${openMaterial ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <p className="pb-4 text-xs md:text-sm text-zinc-600">
                  {item.material ?? "100% cotton. Machine wash cold."}
                </p>
              </div>
            </div>
          </div>
          {/* Material */}

          {/* Variant */}
          <div className="mt-6">
            <p className="text-xs md:text-sm">
              <span className="font-semibold">Variant : </span>
              <span className="text-zinc-600">{item.variant}</span>
            </p>
            <div className="w-25 text-center">
              <img
                src={item.image}
                alt={item.variant}
                className="mt-2 h-25 w-25 object-contain"
              />
              <p className="mt-1 text-[10px] md:text-xs">{item.variant}</p>
            </div>
          </div>
          {/* Variant */}

          {/* Select Size */}
          {needsSize && (
            <div className="mt-6">
              <p className="text-xs md:text-sm font-semibold ">Select Size</p>
              <div className="mt-3 flex gap-2">
                {item.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSize(s);
                      setError("");
                    }}
                    className={`h-10 w-10 border text-xs transition-colors font-semibold ${size === s ? "border-gray-500 bg-gray-500 text-white" : "border-zinc-300 hover:border-black"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
            </div>
          )}
          {/* Select Size */}

          {/* Stock */}
          <div className="mt-6 flex items-center justify-between text-xs md:text-sm">
            <span className="font-semibold">Stock</span>
            <span className="text-[10px] font-medium text-yellow-500">
              {(item.stock ?? 10) <= 5 ? "few pieces left" : "In stock"}
            </span>
          </div>
          {/* Stock */}

          {/* Quantity */}
          <div className="mt-6">
            <p className="text-xs md:text-sm font-semibold">Quantity</p>
            <div className="mt-3 flex items-center gap-4">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-9 w-9 border border-zinc-300 hover:border-black"
              >
                -
              </button>
              <span className="w-6 text-center font-semibold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="h-9 w-9 border border-zinc-300 hover:border-black"
              >
                +
              </button>
            </div>
          </div>
          {/* Quantity */}

          {/* Tombol */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex items-center justify-between bg-gray-500 px-5 py-4 text-xs font-semibold uppercase text-white transition-colors hover:bg-zinc-800"
            >
              Add to cart <i className="ri-arrow-right-line ri-lg"></i>
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="border border-zinc-400 px-5 py-4 text-xs font-semibold uppercase transition-colors hover:bg-gray-500 hover:text-white"
            >
              Buy now
            </button>
          </div>
          {/* Tombol */}
        </div>
        {/* Info */}
      </div>
    </main>
  );
}

export default ProductDetail;
