import { Link } from "react-router-dom";
import { formatRupiah } from "../data/products";

const ProductCard = ({ item, showSwatches = true }) => {
  return (
    <Link to={`/shop/${item.id}`} className="group block">
      <article>
        <div className="relative aspect-4/5 overflow-hidden bg-stone-200">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
          {item.badge && (
            <span className="absolute left-3 top-3 bg-zinc-100 px-3 py-1.5 text-[10px] uppercase">
              {item.badge}
            </span>
          )}
        </div>

        <div className="mt-3">
          <h3 className="font-semibold text-xs md:text-sm">{item.name}</h3>
          <span className=" text-xs md:text-sm text-slate-600">
            {formatRupiah(item.price)}
          </span>
          <p className="mt-1 text-[10px] text-zinc-500 md:text-xs">
            {item.variant}
          </p>

          {showSwatches && item.colors && (
            <div className="mt-2 flex gap-1.5">
              {item.colors.map((color) => (
                <span
                  key={color}
                  className="h-2.5 w-2.5"
                  style={{ background: color }}
                ></span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;
