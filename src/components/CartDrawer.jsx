import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ShoppingCart } from "lucide-react";
import gsap from "gsap";

const PAYMENT_METHODS = ["VISA", "MC", "PayPal", "AMEX"];

const CartDrawer = ({ open, onClose, cartItems = [] }) => {
  const drawerRef = useRef(null);

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
            Tu carrito <span className="text-zinc-400 font-normal">({cartItems.length})</span>
          </h2>
          <button onClick={onClose} className="size-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors">
            <X size={16} className="text-zinc-700" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {cartItems.length === 0 ? (
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
            <div className="flex flex-col gap-4">
              {cartItems.map((item, i) => (
                <div key={i} className="flex gap-4 py-4 border-b border-zinc-100">
                  <div className="w-20 h-24 rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: item.bg }}>
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest">{item.brand}</p>
                      <p className="font-bold text-zinc-900 text-sm">{item.name}</p>
                    </div>
                    <p className="text-zinc-900 font-semibold">
                      ${item.price?.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-zinc-100">
          <p className="text-xs text-zinc-400 mb-1">Devolución gratuita 30 días</p>
          <p className="text-xs text-zinc-400 mb-3">Métodos de pago disponibles</p>
          <div className="flex gap-2 flex-wrap mb-5">
            {PAYMENT_METHODS.map((m) => (
              <span key={m} className="text-[10px] border border-zinc-200 px-2 py-1 rounded text-zinc-500 font-medium">{m}</span>
            ))}
          </div>
          {cartItems.length > 0 && (
            <button className="w-full bg-zinc-900 text-white font-bold py-4 rounded-full hover:bg-zinc-700 transition-colors text-sm uppercase tracking-widest">
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