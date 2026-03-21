import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, getCategories } from "../lib/api.js";
import ProductCard from "./ui/ProductCard";

const PER_PAGE = 6;
const BG_COLORS = ["#f5f5f5","#e8e4de","#1c1c1e","#d6e4f0","#e8f4e8","#2c2c2e"];

const ShopSection = ({ onAddToCart }) => {
  const [products,     setProducts]     = useState([]);
  const [categories,   setCategories]   = useState([]);
  const [activeFilter, setActiveFilter] = useState("TODOS");
  const [page,         setPage]         = useState(1);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(true);
  const navigate = useNavigate();

  // Carga categorías una sola vez
  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  // Carga productos cuando cambia filtro o página
useEffect(() => {
  setLoading(true);
  const params = {
    limit: PER_PAGE,
    page,
    status: "active",
    ...(activeFilter !== "TODOS" ? { categoryId: activeFilter } : {}),
  };
  getProducts(params)
    .then(data => {
      if (Array.isArray(data)) {
        setProducts(data);
        setTotal(data.length);
      } else {
        setProducts(data.items || []);
        setTotal(data.total  || 0);
      }
    })
    .catch((err) => {
      console.error("❌ Error al cargar productos:", err); // ← y esto
    })
    .finally(() => setLoading(false));
}, [activeFilter, page]);
  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* Título + filtros */}
        <div className="flex flex-col sm:flex-row justify-between md:items-center mb-10">
          <h2 className="text-5xl impact text-zinc-900 mb-4 sm:mb-0">
            ÚLTIMOS <br /> PRODUCTOS
          </h2>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            <button
              onClick={() => { setActiveFilter("TODOS"); setPage(1); }}
              className={`${activeFilter === "TODOS" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700"} cursor-pointer md:text-base impact px-4 py-2 rounded-full hover:bg-zinc-900 uppercase hover:text-white transition-all duration-200 ease-in text-nowrap`}
            >
              TODOS
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveFilter(cat.id); setPage(1); }}
                className={`${activeFilter === cat.id ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700"} cursor-pointer md:text-base impact px-4 py-2 rounded-full hover:bg-zinc-900 uppercase hover:text-white transition-all duration-200 ease-in text-nowrap`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grid productos */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: PER_PAGE }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="rounded-3xl bg-zinc-100 mb-3" style={{ aspectRatio: "4/5" }} />
                <div className="h-3 bg-zinc-100 rounded w-1/3 mb-2" />
                <div className="h-6 bg-zinc-100 rounded w-2/3 mb-2" />
                <div className="h-4 bg-zinc-100 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-zinc-400">
            No hay productos disponibles
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  img:   product.images?.[0] || "https://placehold.co/600x750?text=Sin+imagen",
                  bg:    product.bgColor || BG_COLORS[i % BG_COLORS.length],
                  tag:   product.badge  || null,
                  brand: product.brand  || "",
                  price: Number(product.price),
                }}
                onView={() => navigate(`/producto/${product.id}`)}
                onAdd={() => onAddToCart?.(product)}
              />
            ))}
          </div>
        )}

        {/* Paginador */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-900 hover:text-white transition-all disabled:opacity-30 flex items-center justify-center"
            >‹</button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-full font-bold transition-all ${page === p ? "bg-zinc-900 text-white" : "bg-zinc-100 hover:bg-zinc-200"}`}>
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-900 hover:text-white transition-all disabled:opacity-30 flex items-center justify-center"
            >›</button>
          </div>
        )}
      </div>

      {/* Ver todos */}
      <div className="flex justify-center items-center mt-8">
        <a href="/product"
          className="bg-zinc-900 text-white uppercase px-10 py-4 flex items-center justify-center rounded-full font-bold tracking-widest text-sm cursor-pointer hover:bg-zinc-700 transition-colors">
          VER MAS
        </a>
      </div>
    </div>
  );
};

export default ShopSection;