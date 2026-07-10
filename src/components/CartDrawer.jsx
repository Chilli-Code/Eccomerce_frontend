import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ShoppingCart, Plus, Minus, Trash2, Ticket } from "lucide-react";
import gsap from "gsap";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { notify } from "../lib/notify";
import { useNavigate } from "react-router-dom";

const PAYMENT_METHODS = ["VISA", "MC", "PayPal", "AMEX"];

const CartDrawer = () => {
  const drawerRef = useRef(null);
  const { 
    items, 
    open, 
    setOpen, 
    removeItem, 
    updateQty, 
    subtotal,      // ✅ Cambiado: antes era total
    discount,      // ✅ Nuevo
    finalTotal,    // ✅ Nuevo
    count,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();
  
  const [couponCode, setCouponCode] = useState("");
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const onClose = () => setOpen(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      window.__smoother?.paused(true);
    } else {
      window.__smoother?.paused(false);
    }
  }, [open]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return notify.error("Ingresa un código");
    setLoadingCoupon(true);
    try {
      const result = await applyCoupon(couponCode);
      if (result.success) {
        notify.success(`Cupón ${couponCode} aplicado`, "¡Descuento aplicado!");
        setCouponCode("");
      } else {
        notify.error(result.error || "Cupón inválido", "No se puede aplicar");
      }
    } catch (err) {
      notify.error("Error al validar cupón");
    } finally {
      setLoadingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    notify.success("Cupón eliminado");
  };

  useEffect(() => {
    if (!drawerRef.current) return;
    gsap.to(drawerRef.current, {
      x: open ? "0%" : "100%",
      duration: open ? 0.45 : 0.35,
      ease: open ? "power3.out" : "power3.in",
    });
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && open && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/30 transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full z-[70] bg-white flex flex-col shadow-2xl"
        style={{ width: "min(420px, 100vw)", transform: "translateX(100%)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
          <h2 className="text-lg font-bold text-zinc-900">
            Tu carrito <span className="text-zinc-400 font-normal">({count})</span>
          </h2>
          <button onClick={onClose} className="size-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors">
            <X size={16} className="text-zinc-700" />
          </button>
        </div>
        
        {/* Cupón */}
        <div className="mb-2 mt-2">
          <div className="flex gap-2 px-3">
            <div className="flex-1 relative">
              <Ticket size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Código de cupón"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                disabled={!!appliedCoupon}
                className="w-full pl-8 pr-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:bg-zinc-50"
              />
            </div>
            {!appliedCoupon ? (
              <button
                onClick={handleApplyCoupon}
                disabled={loadingCoupon || !couponCode.trim()}
                className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-700 disabled:opacity-50"
              >
                {loadingCoupon ? "..." : "Aplicar"}
              </button>
            ) : (
              <button
                onClick={handleRemoveCoupon}
                className="px-4 py-2 border border-red-200 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50"
              >
                Quitar
              </button>
            )}
          </div>
          {appliedCoupon && (
            <p className="text-xs text-green-600 mt-1 px-3">
              Cupón aplicado: {appliedCoupon.code} -{" "}
              {appliedCoupon.type === "percentage" 
                ? `${appliedCoupon.value}% descuento` 
                : `$${appliedCoupon.value} descuento`}
            </p>
          )}
        </div>
        
        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6" data-scroll="false">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
              <div className="size-16 rounded-full border border-zinc-200 flex items-center justify-center">
                <ShoppingCart size={22} className="text-zinc-400" />
              </div>
              <p className="text-zinc-500 text-sm">Tu carrito está vacío</p>
              <button onClick={onClose} className="bg-zinc-900 text-white text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-zinc-700 transition-colors">
                Continuar comprando
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 overflow-y-scroll">
              {/* Productos */}
              {items.map((item) => (
                <div key={`${item.id}-${item.variantId}`} className="flex gap-4 py-4 border-b border-zinc-100">
                  <div className="w-20 h-24 rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: item.bg }}>
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest">{item.brand}</p>
                      <Link 
                        to={`/producto/${item.id}`} 
                        onClick={onClose}
                        className="font-bold text-zinc-900 text-sm hover:underline"
                      >
                        {item.name}
                      </Link>
                      {item.variantId && (
                        <p className="text-xs text-zinc-500 mt-0.5">Variante: {item.name.split('(')[1]?.replace(')', '')}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQty(item.id, item.qty - 1, item.variantId)}
                          className="size-6 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                        <button 
                          onClick={() => updateQty(item.id, item.qty + 1, item.variantId)}
                          className="size-6 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-zinc-900 font-semibold text-sm">
                          ${(item.price * item.qty).toLocaleString("es-CO", { minimumFractionDigits: 0 })}
                        </p>
                        <button 
                          onClick={() => removeItem(item.id, item.variantId)}
                          className="text-zinc-300 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100">
          {items.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-zinc-500">Subtotal</span>
                <span className="text-sm text-zinc-900">
                  ${subtotal?.toLocaleString("es-CO", { minimumFractionDigits: 0 }) || 0}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-green-600">Descuento</span>
                  <span className="text-sm text-green-600">
                    -${discount?.toLocaleString("es-CO", { minimumFractionDigits: 0 }) || 0}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center mb-3 pt-2 border-t border-zinc-100">
                <span className="text-sm font-bold text-zinc-900">Total</span>
                <span className="text-lg font-bold text-zinc-900">
                  ${finalTotal?.toLocaleString("es-CO", { minimumFractionDigits: 0 }) || 0}
                </span>
              </div>
            </>
          )}
          <div className="flex flex-col gap-1">
            <p className="text-xs text-zinc-400">Devolución gratuita 30 días</p>
            <p className="text-xs text-zinc-400">Métodos de pago disponibles</p>
          </div>
          <div className="flex gap-2 flex-wrap mb-5">
            {PAYMENT_METHODS.map((m) => (
              <span key={m} className="text-[10px] border border-zinc-200 px-2 py-1 rounded text-zinc-500 font-medium">{m}</span>
            ))}
          </div>
          {items.length > 0 && (
            <button 
              onClick={() => {
                onClose();
                navigate("/checkout");
              }}
              className="w-full bg-zinc-900 text-white font-bold py-4 rounded-full hover:bg-zinc-700 transition-colors text-sm uppercase tracking-widest"
            >
              Ir al pago
            </button>
          )}
        </div>
      </div>
    </>,
    document.body
  );
};

export default CartDrawer;