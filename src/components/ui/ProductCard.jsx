// src/components/ui/ProductCard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";

const ProductCard = ({ product, onView, onAdd }) => {
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    setAdded(true);
    onAdd?.();
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="flex flex-col group cursor-pointer" onClick={onView}>
      <div className="relative w-full rounded-3xl mb-3 overflow-hidden"
        style={{ backgroundColor: product.bg, aspectRatio: "4 / 5" }}>
        <img src={product.img} alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105" />
        {product.tag && (
          <span className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm text-zinc-900 text-xs font-semibold px-3 py-1.5 rounded-full">
            {product.tag}
          </span>
        )}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 z-10">
          <button onClick={handleAdd}
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-7 py-3 rounded-full transition-all duration-300 ${added ? "bg-green-500 text-white scale-95" : "bg-white text-zinc-900 hover:bg-zinc-100"}`}>
            <ShoppingCart size={14} />
            {added ? "¡Agregado!" : "Agregar"}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onView?.(); }}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-7 py-3 rounded-full bg-zinc-900 text-white hover:bg-zinc-700 transition-colors">
            <Eye size={14} />
            Ver producto
          </button>
        </div>
      </div>
      <p className="text-xs text-zinc-400 tracking-widest uppercase mb-0.5">{product.brand}</p>
      <p className="text-2xl impact text-zinc-900 leading-none mb-1">{product.name}</p>
      <p className="text-base text-zinc-500">${product.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>
    </div>
  );
};

export default ProductCard;