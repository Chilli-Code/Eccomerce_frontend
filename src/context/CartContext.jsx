import { createContext, useContext, useState, useEffect } from "react";
import { couponsApi } from "../lib/api";

const CartContext = createContext(null);

const BG_COLORS = ["#f5f5f5","#e8e4de","#1c1c1e","#d6e4f0","#e8f4e8","#2c2c2e"];

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cart") || "[]"); }
    catch { return []; }
  });
  const [open, setOpen] = useState(false);
  
  // Estado para el cupón aplicado
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try { return JSON.parse(localStorage.getItem("appliedCoupon") || "null"); }
    catch { return null; }
  });

  // Persiste carrito en localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Persiste cupón en localStorage
  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem("appliedCoupon", JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem("appliedCoupon");
    }
  }, [appliedCoupon]);

  const addItem = (product, selectedVariant = null) => {
    const variantPrice = selectedVariant?.price 
      ? Number(selectedVariant.price) 
      : product.price;
    
    const variantName = selectedVariant?.name 
      ? ` (${selectedVariant.name})` 
      : "";

    setItems(prev => {
      const existing = prev.find(
        item => item.id === product.id && item.variantId === selectedVariant?.id
      );
      
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.variantId === selectedVariant?.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      
      return [...prev, {
        id: product.id,
        variantId: selectedVariant?.id ?? null, 
        name: product.name + variantName,
        price: variantPrice,
        qty: 1,
        img: product.images?.[0] || product.img,
        brand: product.brand,
        bg: product.bgColor || "#f5f5f5",
        shippingMethod: product.shippingMethod || "default",
        shippingPrice: product.shippingPrice ? Number(product.shippingPrice) : null,
      }];
    });
  };
  
  const removeItem = (id, variantId = null) => {
    setItems(prev =>
      prev.filter(item => {
        const itemVariantId = item.variantId ?? null;
        const targetVariantId = variantId ?? null;
        return !(item.id === id && itemVariantId === targetVariantId);
      })
    );
  };

  const updateQty = (id, qty, variantId = null) => {
    if (qty < 1) {
      removeItem(id, variantId);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        const itemVariantId = item.variantId ?? null;
        const targetVariantId = variantId ?? null;
        
        if (item.id === id && itemVariantId === targetVariantId) {
          return { ...item, qty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null); // Limpiar cupón también
  };
  
  // Cálculo de totales
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.type === "percentage") {
      return subtotal * (appliedCoupon.value / 100);
    } else if (appliedCoupon.type === "fixed") {
      return appliedCoupon.value;
    }
    return 0;
  };
  
  const discount = calculateDiscount();
  const finalTotal = subtotal - discount;
  const count = items.reduce((s, i) => s + i.qty, 0);
  
  // Función para aplicar cupón
  const applyCoupon = async (code) => {
    try {
      const result = await couponsApi.validate(code, subtotal);
      if (result.valid) {
        setAppliedCoupon(result.coupon);
        return { success: true, coupon: result.coupon };
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error("Error applying coupon:", error);
      return { success: false, error: error.message };
    }
  };
  
  // Función para remover cupón
  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
  <CartContext.Provider value={{ 
    items, 
    open, 
    setOpen, 
    addItem, 
    removeItem, 
    updateQty, 
    clearCart, 
    subtotal: subtotal || 0,     // 👈 Valor por defecto
    discount: discount || 0,     // 👈 Valor por defecto
    finalTotal: finalTotal || 0, // 👈 Valor por defecto
    count: count || 0,
    appliedCoupon: appliedCoupon || null,
    applyCoupon,
    removeCoupon
  }}>
    {children}
  </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);