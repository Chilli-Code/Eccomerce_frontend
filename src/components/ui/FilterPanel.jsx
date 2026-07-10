import { X } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Destacados",            value: "featured"   },
  { label: "Más recientes",         value: "newest"     },
  { label: "Precio: menor a mayor", value: "price_asc"  },
  { label: "Precio: mayor a menor", value: "price_desc" },
];

const FilterPanel = ({ filterPanelRef, activeCategoryName, activeFilterCount, activeFilter, setActiveFilter, selectedBrands, toggleBrand, clearAll, sort, setSort, brands }) => {
  return (
<div
  ref={filterPanelRef}
  className="flex-shrink-0 overflow-hidden min-h-screen lg:min-h-0"
  style={{
    width: window.innerWidth >= 1024 ? 0 : "100%",
    opacity: window.innerWidth >= 1024 ? 0 : 1
  }}
>
      <div className="w-[260px] p-5">

        {/* Filtros aplicados */}
        {activeFilterCount > 0 && (
          <div className="mb-6">
            <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-3">Filtros aplicados</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {activeFilter !== "TODOS" && (
                <span className="flex items-center gap-1.5 border border-zinc-200 rounded-full px-3 py-1 text-xs font-medium">
                  {activeCategoryName || activeFilter}
                  <button onClick={() => setActiveFilter("TODOS")}><X size={11} /></button>
                </span>
              )}
              {selectedBrands.map((b) => (
                <span key={b} className="flex items-center gap-1.5 border border-zinc-200 rounded-full px-3 py-1 text-xs font-medium">
                  {b}
                  <button onClick={() => toggleBrand(b)}><X size={11} /></button>
                </span>
              ))}
            </div>
            <button onClick={clearAll} className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 underline underline-offset-2">
              Limpiar todo
            </button>
          </div>
        )}

        {/* Ordenar */}
        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-3">Ordenar por</p>
          {SORT_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 py-1.5 cursor-pointer group">
              <span className={`size-4 rounded-full border-2 flex items-center justify-center transition-all ${sort === opt.value ? "border-zinc-900" : "border-zinc-300"}`}>
                {sort === opt.value && <span className="size-2 rounded-full bg-zinc-900" />}
              </span>
              <input type="radio" className="hidden" value={opt.value} checked={sort === opt.value} onChange={() => setSort(opt.value)} />
              <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>

        {/* Marca */}
        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-3">Marca</p>
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-3 py-1.5 cursor-pointer group">
              <span className={`size-4 rounded border-2 flex items-center justify-center transition-all ${selectedBrands.includes(brand) ? "border-zinc-900 bg-zinc-900" : "border-zinc-300"}`}>
                {selectedBrands.includes(brand) && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <input type="checkbox" className="hidden" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} />
              <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">{brand}</span>
            </label>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FilterPanel;