import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "ef-cart";
const MAX_QTY = 10;

// Satu baris keranjang = kombinasi produk + size + warna
const makeLineId = (i) => `${i.id}-${i.size}-${i.color}`;

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
    } catch {
      return [];
    }
  });

  //   Simpan otomatis setiap keranjang berubah
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage penuh / diblokir : abaikan
    }
  }, [items]);

  // Dipanggil dari tombol Add to cart / Buy now
  const addItem = (product, { size, color, qty = 1 }) => {
    const lineId = makeLineId({ id: product.id, size, color });
    setItems((prev) => {
      const found = prev.find((i) => i.lineId === lineId);
      if (found) {
        return prev.map((i) =>
          i.lineId === lineId
            ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) }
            : i,
        );
      }
      return [
        ...prev,
        {
          lineId,
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          sizes: product.sizes,
          colors: [color],
          size,
          color,
          qty,
        },
      ];
    });
  };

  const updateItem = (lineId, patch) =>
    setItems((prev) => {
      const next = prev.map((i) => {
        if (i.lineId !== lineId) return i;
        const u = { ...i, ...patch };
        return { ...u, lineId: makeLineId(u) };
      });
      // Gabungkan baris yang jadi kembar setelah ganti size/warna
      return next.reduce((acc, i) => {
        const dup = acc.find((x) => x.lineId === i.lineId);
        if (dup) dup.qty = Math.min(MAX_QTY, dup.qty + i.qty);
        else acc.push({ ...i });
        return acc;
      }, []);
    });

  const removeItem = (lineId) =>
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));

  const clearCart = () => setItems([]);

  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateItem, removeItem, clearCart, count }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};
