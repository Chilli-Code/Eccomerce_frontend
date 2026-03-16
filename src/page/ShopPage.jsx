import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { productData, filterButtonsData } from "../assets/data";
import ProductCard from "../components/ui/ProductCard";
import Footer from "../components/Footer";
import FilterPanel from "../components/ui/FilterPanel";
import MobileFilterModal from "../components/ui/MobileFilterModal";

const SORT_OPTIONS = [
  { label: "Destacados",       value: "featured" },
  { label: "Más recientes",    value: "newest" },
  { label: "Precio: menor a mayor", value: "price_asc" },
  { label: "Precio: mayor a menor", value: "price_desc" },
];
gsap.registerPlugin(ScrollTrigger);
const ShopPage = () => {
  const navigate           = useNavigate();
  const [activeFilter, setActiveFilter] = useState("TODOS");
  const [showFilters, setShowFilters]   = useState(false);
  const [sort, setSort]                 = useState("featured");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const filterPanelRef = useRef(null);
  const gridRef        = useRef(null);
  const filterBarRef   = useRef(null);
  const barOffsetRef   = useRef(null);
const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Marcas únicas
  const brands = [...new Set(productData.map((p) => p.brand))];

  // Filtrar + ordenar
  const filtered = productData
    .filter((p) => activeFilter === "TODOS" || p.category === activeFilter)
    .filter((p) => selectedBrands.length === 0 || selectedBrands.includes(p.brand))
    .sort((a, b) => {
      if (sort === "price_asc")  return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      return 0;
    });

  const activeFilterCount = selectedBrands.length + (activeFilter !== "TODOS" ? 1 : 0);
useEffect(() => {
  if (!filterBarRef.current) return;

  const ctx = gsap.context(() => {
    ScrollTrigger.create({
      trigger: filterBarRef.current,
      start: "top top",
      end: "bottom+=99999 top",
      pin: true,
      pinSpacing: false,
    });
  }, filterBarRef); // 👈 MUY IMPORTANTE

  return () => ctx.revert();
}, []);
  // Animación panel filtros
  useEffect(() => {
    const panel = filterPanelRef.current;
    if (!panel) return;
    if (showFilters) {
      gsap.fromTo(panel,
        { x: -20, opacity: 0, width: 0 },
        { x: 0, opacity: 1, width: 260, duration: 0.4, ease: "power3.out" }
      );
    } else {
      gsap.to(panel, { x: -10, opacity: 0, width: 0, duration: 0.3, ease: "power3.in" });
    }
  }, [showFilters]);

  // Animar grid al cambiar filtros
  useEffect(() => {
    if (!gridRef.current) return;
    gsap.fromTo(gridRef.current.children,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" }
    );
  }, [filtered.length, activeFilter, selectedBrands]);

  // Pin barra de filtros con ScrollTrigger (compatible con ScrollSmoother)


  // Sticky compatible con ScrollSmoother
  useEffect(() => {
    const bar = filterBarRef.current;
    const sentinel = barOffsetRef.current;
    if (!bar || !sentinel) return;

    const onScroll = () => {
     
      const offsetTop = sentinel.offsetTop;
      if (scrollY >= offsetTop) {
        bar.style.position = "fixed";
        bar.style.top = "0";
        bar.style.left = sentinel.getBoundingClientRect().left + "px";
        bar.style.width = sentinel.offsetWidth + "px";
        bar.style.zIndex = "30";
        bar.style.backgroundColor = "#fff";
      } else {
        bar.style.position = "relative";
        bar.style.top = "";
        bar.style.left = "";
        bar.style.width = "";
      }
    };

    if (window.__smoother) {
      window.__smoother.addEventListener("scroll", onScroll);
      return () => window.__smoother.removeEventListener("scroll", onScroll);
    } else {
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, []);

useEffect(() => {
  if (showFilters) {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }
  return () => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  };
}, [showFilters]);
  const toggleBrand = (brand) =>
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );

  const clearAll = () => { setSelectedBrands([]); setActiveFilter("TODOS"); };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-24">

        {/* Título */}
        <p className="text-xs tracking-widest uppercase text-zinc-400 mb-1">Tienda</p>
        <h1 className="text-5xl impact text-zinc-900 mb-6">TODOS LOS PRODUCTOS</h1>

        {/* Categorías */}
        <div className="flex gap-2 flex-wrap mb-6">
          {filterButtonsData.map((btn) => (
            <button key={btn.name} onClick={() => setActiveFilter(btn.name)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
                activeFilter === btn.name
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
              }`}>
              {btn.name}
            </button>
          ))}
        </div>

        {/* Barra — filtros + resultados */}
        <div ref={filterBarRef} className="flex items-center justify-between mb-6 border-t border-b border-zinc-100 py-3  bg-white z-30">
<button
  onClick={() => {
    if (window.innerWidth < 1024) {
      setShowMobileFilters(true); // Móvil → abrir modal
    } else {
      setShowFilters((v) => !v);  // Escritorio → alternar panel lateral
    }
  }}
  className="flex items-center gap-2 text-sm font-semibold border border-zinc-200 rounded-full px-4 py-2 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all"
>
  <SlidersHorizontal size={14} />
  {showFilters || showMobileFilters ? "Ocultar filtros" : "Mostrar filtros"}
  {activeFilterCount > 0 && (
    <span className="bg-zinc-900 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
      {activeFilterCount}
    </span>
  )}
</button>
          <span className="text-xs text-zinc-400 tracking-widest uppercase">
            {filtered.length} resultados
          </span>
        </div>

        {/* Layout: panel + grid */}
       <div className="flex gap-8 items-stretch">

          {/* Panel filtros — animado con GSAP */}
          <div className="hidden lg:block">
<FilterPanel
  filterPanelRef={filterPanelRef}
  activeFilterCount={activeFilterCount}
  activeFilter={activeFilter}
  setActiveFilter={setActiveFilter}
  selectedBrands={selectedBrands}
  toggleBrand={toggleBrand}
  clearAll={clearAll}
  sort={sort}
  setSort={setSort}
  brands={brands}
/>

          </div>

          {/* Grid productos */}
          <div
            ref={gridRef}
            className={`flex-1 grid gap-5 ${showFilters ? "grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-2 lg:grid-cols-3"}`}
          >
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onView={(id) => navigate(`/producto/${id}`)}
              />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4 text-center">
                <p className="text-zinc-400 text-sm">No hay productos con estos filtros.</p>
                <button onClick={clearAll} className="text-xs font-bold uppercase tracking-widest underline text-zinc-900">
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
{/* MOBILE FILTER MODAL */}
<MobileFilterModal
  show={showMobileFilters}
  onClose={() => setShowMobileFilters(false)}
  activeFilterCount={activeFilterCount}
  activeFilter={activeFilter}
  setActiveFilter={setActiveFilter}
  selectedBrands={selectedBrands}
  toggleBrand={toggleBrand}
  clearAll={clearAll}
  sort={sort}
  setSort={setSort}
  brands={brands}
  filteredCount={filtered.length}
/>
      </div>
      <Footer />
    </div>
  );
};

export default ShopPage;