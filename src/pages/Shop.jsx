import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

function Shop() {
  return (
    <main className="px-6 py-6 md:px-10 md:py-6">
      <p className="text-[10px] uppercase tracking-widest text-zinc-500 md:text-xs">
        All products
      </p>
      <h1 className="mt-4 font-anton text-5xl uppercase leading-none md:text-7xl">
        Shop.
      </h1>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}

export default Shop;
