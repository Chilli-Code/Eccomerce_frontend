import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

const BG_COLORS = ["#f5f5f5","#e8e4de","#1c1c1e","#d6e4f0","#e8f4e8","#2c2c2e"];

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cart") || "[]"); }
    catch { return []; }
  });
  const [open, setOpen] = useState(false);

  // Persiste en localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, {
        id:    product.id,
        name:  product.name,
        price: Number(product.price),
        img:   product.images?.[0] || product.img || "",
        bg:    product.bgColor || BG_COLORS[prev.length % BG_COLORS.length],
        brand: product.brand || "",
        qty:   1,
      }];
    });
    setOpen(true);
  };

  const removeItem  = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const updateQty   = (id, qty) => {
    if (qty < 1) return removeItem(id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };
  const clearCart   = () => setItems([]);
  const total       = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count       = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, open, setOpen, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);