import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import FilterPanel from "./FilterPanel";

const MobileFilterModal = ({
  show,
  onClose,
  activeFilterCount,
  activeFilter,
  setActiveFilter,
  selectedBrands,
  toggleBrand,
  clearAll,
  sort,
  setSort,
  brands,
  filteredCount
}) => {
  // Bloquear scroll del body
  useEffect(() => {
    if (show) {
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
  }, [show]);

  return createPortal(
    <div
      className={`fixed inset-0 z-[60] flex flex-col bg-white h-screen transition-transform duration-300
        ${show ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-full opacity-0 pointer-events-none"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 flex-shrink-0">
        <h2 className="text-lg font-bold text-zinc-900">Filtros</h2>
        <button
          onClick={onClose}
          className="size-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors"
        >
          <X size={18} className="text-zinc-700" />
        </button>
      </div>

      {/* Contenido scrollable */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <FilterPanel
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

      {/* Bottom button fijo */}
      <div className="flex-shrink-0 w-full p-4 bg-white border-t">
        <button
          onClick={onClose}
          className="w-full bg-black text-white py-4 rounded-full font-semibold"
        >
          Ver resultados ({filteredCount})
        </button>
      </div>
    </div>,
    document.body
  );
};

export default MobileFilterModal;