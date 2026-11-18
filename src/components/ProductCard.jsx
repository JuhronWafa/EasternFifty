const ProductCard = ({ item }) => {
  return (
    <article>
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
            style={{ background: color }}
          ></span>
        ))}
      </div>
    </article>
  );
};

export default ProductCard;
