import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Search, ShoppingCart, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { productData } from "../assets/data";

const SUGGESTED = ["iPhone", "Samsung", "AirPods", "Smartwatch", "Auriculares", "Accesorios"];

// ProductCard inline simplificada para el drawer
const MiniCard = ({ product, onClose }) => {
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const handleView = () => {
    navigate(`/producto/${product.id}`);
    onClose();
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="flex flex-col group cursor-pointer" onClick={handleView}>
      {/* Imagen */}
      <div
        className="relative w-full rounded-2xl mb-2 overflow-hidden"
        style={{ backgroundColor: product.bg, aspectRatio: "4 / 5" }}
      >
        <img
          src={product.img}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.tag && (
          <span className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm text-zinc-900 text-[10px] font-semibold px-2 py-1 rounded-full">
            {product.tag}
          </span>
        )}
        {/* Hover */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 z-10">
          <button onClick={handleAdd}
            className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-all ${added ? "bg-green-500 text-white" : "bg-white text-zinc-900"}`}>
            <ShoppingCart size={12} />
            {added ? "¡Listo!" : "Agregar"}
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleView(); }}
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full bg-zinc-900 text-white hover:bg-zinc-700 transition-colors">
            <Eye size={12} />
            Ver
          </button>
        </div>
      </div>
      {/* Info */}
      <p className="text-[10px] text-zinc-400 tracking-widest uppercase">{product.brand}</p>
      <p className="text-sm font-bold text-zinc-900 leading-tight">{product.name}</p>
      <p className="text-sm text-zinc-500">${product.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>
    </div>
  );
};

// ── SEARCH DRAWER ─────────────────────────────────────────
const SearchDrawer = ({ open, onClose }) => {
  const drawerRef  = useRef(null);
  const inputRef   = useRef(null);
  const [query, setQuery] = useState("");

  const results = query.trim().length > 0
    ? productData.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (!drawerRef.current) return;
    gsap.to(drawerRef.current, {
      x: open ? "0%" : "100%",
      duration: open ? 0.45 : 0.35,
      ease: open ? "power3.out" : "power3.in",
    });
    if (open) setTimeout(() => inputRef.current?.focus(), 400);
    else setQuery("");
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
        className="fixed top-0 right-0 h-full z-[70] bg-white flex flex-col shadow-2xl overflow-hidden"
        style={{ width: "min(560px, 100vw)", transform: "translateX(100%)" }}
      >
  
                  <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
          <h2 className="text-lg font-bold text-zinc-900">
            Buscar productos
          </h2>
          <button onClick={onClose} className="size-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors">
            <X size={15} className="text-zinc-700" />
          </button>


        </div>
        {/* Search bar */}

                  <div className="flex items-center gap-3 mt-4 px-5 py-4 border-b border-zinc-100 bg-zinc-100 rounded-xl  text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-zinc-900 transition mb-2 mx-2">
          <Search size={18} className="text-zinc-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none bg-transparent"
          />

        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          {query.trim() === "" ? (
            <>
              <p className="text-sm font-bold text-zinc-900 mb-4">Búsquedas sugeridas</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED.map((s) => (
                  <button key={s} onClick={() => setQuery(s)}
                    className="border border-zinc-200 rounded-full px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <Search size={28} className="text-zinc-300" />
              <p className="text-zinc-500 text-sm">Sin resultados para <strong>"{query}"</strong></p>
            </div>
          ) : (
            <>
              <p className="text-sm font-bold text-zinc-900 mb-4">
                Productos <span className="text-zinc-400 font-normal">({results.length})</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {results.map((product) => (
                  <MiniCard key={product.id} product={product} onClose={onClose} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>,
    document.body
  );
};

export default SearchDrawer;