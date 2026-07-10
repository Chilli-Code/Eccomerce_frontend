import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Search, ShoppingCart, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { productData } from "../assets/data";
import { getProducts, getCategories } from "../lib/api";
import { useCart } from "../context/CartContext";
import WishlistButton from "./ui/WishlistButton";
import ProductCard from "./ui/ProductCard";

const SUGGESTED = ["iPhone", "Samsung", "AirPods", "Smartwatch", "Auriculares", "Accesorios"];


// ── SEARCH DRAWER ─────────────────────────────────────────
const SearchDrawer = ({ open, onClose, user, onAuthRequired }) => {
  const navigate = useNavigate();
  const drawerRef = useRef(null);
  const inputRef = useRef(null);
  const { addItem } = useCart();

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [results, setResults] = useState([]);
  const [featured, setFeatured] = useState([]); // más vendidos / ofertas
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

useEffect(() => {
  if (open) {
    window.__smoother?.paused(true);
  } else {
    window.__smoother?.paused(false);
  }
}, [open]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  useEffect(() => {
    getCategories()
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => { });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 350);
    return () => clearTimeout(t);
  }, [query]);



  useEffect(() => {
    if (!debounced.trim()) { setResults([]); return; }
    setLoading(true);
    getProducts({ search: debounced, status: "active", limit: 9 })
      .then(data => setResults(Array.isArray(data) ? data : data.items || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debounced]);



  useEffect(() => {
    getProducts({ status: "active", limit: 6, sort: "newest" })
      .then(data => setFeatured(Array.isArray(data) ? data : data.items || []))
      .catch(() => { });
  }, []);


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
              <p className="text-sm font-bold text-zinc-900 mb-4">Categorias</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);  // ← pasa el id
                      setQuery(cat.name);           // ← muestra el nombre en el input
                    }}
                    className="border border-zinc-200 rounded-full px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              {/* Sugeridas */}
              <p className="text-sm font-bold text-zinc-900 mb-4">Búsquedas sugeridas</p>
              <div className="flex w-full overflow-x-auto gap-2 mb-8">
                {SUGGESTED.map((s) => (
                  <button key={s} onClick={() => setQuery(s)}
                    className="shrink-0 border border-zinc-200 rounded-full px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all">
                    {s}
                  </button>
                ))}
              </div>

              {/* Más recientes / destacados */}
              {featured.length > 0 && (
                <>
                  <p className="text-sm font-bold text-zinc-900 mb-4">Más recientes</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {featured.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        variant="mini"
                        user={user} 
                        onView={() => {
                          navigate(`/producto/${product.id}`);
                          onClose();
                        }}
                        onAdd={() => addItem(product)}
                        onAuthRequired={onAuthRequired}
                      />

                    ))}
                  </div>
                </>
              )}
            </>

          ) : loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="rounded-2xl bg-zinc-100 mb-2" style={{ aspectRatio: "4/5" }} />
                  <div className="h-3 bg-zinc-100 rounded w-1/2 mb-1" />
                  <div className="h-4 bg-zinc-100 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <Search size={28} className="text-zinc-300" />
              <p className="text-zinc-500 text-sm">Sin resultados para <strong>"{query}"</strong></p>
            </div>
          ) : (
            <>
              <p className="text-sm font-bold text-zinc-900 mb-4">
                Resultados <span className="text-zinc-400 font-normal">({results.length})</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {results.map((product) => (
                   <ProductCard
                        key={product.id}
                        product={product}
                        variant="mini"
                        user={user} 
                        onView={() => {
                          navigate(`/producto/${product.id}`);
                          onClose();
                        }}
                        onAdd={() => addItem(product)}
                        onAuthRequired={onAuthRequired}
                      />
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