import { ShoppingCart, Check, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { useState } from "react";
import WishlistButton from "./ui/WishlistButton";
import DOMPurify from 'dompurify';

const ProductInfo = ({ product, selectedColor,user , setSelectedColor, selectedStorage, setSelectedStorage, added, handleAdd, selectedVariant, setSelectedVariant, onAuthRequired  }) => {  const [descModal, setDescModal] = useState(false);
// Cambia esta línea:
const displayPrice     = selectedVariant?.price ? Number(selectedVariant.price) : Number(product.price);
const displaySalePrice = Number(product.salePrice);
const hasDiscount      = displaySalePrice > 0 && displaySalePrice < displayPrice;
  const handleAddWithAuth = () => {
  if (!user) {
    onAuthRequired?.();
    return;
  }
  handleAdd();
};
return (
    <div className="flex flex-col pt-2 w-full pr-0 md:pr-11 lg:pr-11">
      
      {/* TAG, BRAND, SKU */}
      <div className="w-full flex items-center gap-2 mb-5 justify-between">
      <div className="flex items-center gap-2">
        {product.tag && (
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-zinc-900 text-white px-2 py-1 rounded-full w-fit">
            {product.tag}
          </span>
        )}
        <p className="text-xs tracking-widest uppercase text-zinc-400 font-semibold">
          {product.brand || "Marca"}
        </p>
        {product.sku && (
          <p className="text-[11px] text-zinc-400 font-mono">
            SKU: {product.sku}
          </p>
        )}
      </div>
        <WishlistButton 
        productId={product.id}
        className="border-2 border-zinc-300 "  
        onAuthRequired={onAuthRequired} 
        user={user}
        />

      </div>

      {/* NOMBRE */}
      <h1 className="impact text-5xl lg:text-6xl text-zinc-900 leading-none mb-4">
        {product.name}
      </h1>

      {/* ESTRELLAS */}
      <div className="flex items-center gap-2 mb-5">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-zinc-900 text-zinc-900" />)}
        </div>
        <span className="text-zinc-400 text-xs">4.9 · 238 reseñas</span>
      </div>

      {/* PRECIO */}
      <div className="flex items-baseline gap-3 mb-3">
  {/* Precio principal — si hay descuento muestra el salePrice, si no el price */}
  <span className="text-4xl font-bold text-zinc-900">
    {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })
      .format(hasDiscount ? displaySalePrice : displayPrice)}
  </span>

  {/* Precio tachado — solo si hay descuento */}
  {hasDiscount && (
    <span className="text-zinc-400 line-through text-xl">
      {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })
        .format(displayPrice)}
    </span>
  )}

  {/* Porcentaje de descuento */}
  {hasDiscount && (
    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
      -{Math.round((1 - displaySalePrice / displayPrice) * 100)}%
    </span>
  )}
      </div>

      {/* STOCK */}
      {product.status === "out_of_stock" ? (
        <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-4">
          Agotado
        </p>
      ) : (
        <p className="text-green-600 text-xs font-medium mb-4">
          {product.stock} disponibles
        </p>
      )}
{/* TALLAS */}
{product.variants?.filter(v => v.variantType === "size").length > 0 && (
  <div className="mb-7">
    <div className="flex justify-between items-center mb-3">
      <p className="text-xs font-bold tracking-widest uppercase text-zinc-500">Talla</p>
      {selectedVariant && (
        <p className="text-xs font-semibold text-zinc-900">{selectedVariant.name}</p>
      )}
    </div>
    <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-2">
      {product.variants
        .filter(v => v.variantType === "size")
        .map((v) => (
<button
  key={v.id}
  onClick={() => setSelectedVariant(v.id === selectedVariant?.id ? null : v)}
  disabled={v.stock === 0}
  className={`flex flex-col items-center px-3 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide border-2 transition-all
    ${v.stock === 0
      ? "opacity-40 cursor-not-allowed border-zinc-200 text-zinc-400 line-through"
      : selectedVariant?.id === v.id
      ? "bg-zinc-900 text-white border-zinc-900"
      : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-500"
    }`}
>
  <span>{v.name}</span>
  <span className={`text-[9px] font-normal mt-0.5 ${selectedVariant?.id === v.id ? "text-zinc-300" : "text-zinc-400"}`}>
    {v.stock === 0 ? "Agotado" : `${v.stock} uds`}
  </span>
</button>
        ))}
    </div>
    {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
      <p className="text-xs text-amber-600 mt-2">
        ⚡ Solo {selectedVariant.stock} disponibles en esta talla
      </p>
    )}
  </div>
)}
      {/* COLORES */}
      {product.colors?.length > 0 && (
        <div className="mb-7">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-bold tracking-widest uppercase text-zinc-500">Color</p>
            <p className="text-xs font-semibold text-zinc-900">{product.colorNames?.[selectedColor]}</p>
          </div>
          <div className="flex gap-2.5">
            {product.colors.map((color, i) => (
              <button key={i} onClick={() => setSelectedColor(i)} title={product.colorNames?.[i]}
                className={`size-8 rounded-full transition-all ${selectedColor === i ? "ring-2 ring-offset-2 ring-zinc-900 scale-110" : "ring-1 ring-zinc-200 hover:ring-zinc-400"}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ALMACENAMIENTO */}
      {product.storage?.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-bold tracking-widest uppercase text-zinc-500">Almacenamiento</p>
            <p className="text-xs font-semibold text-zinc-900">{product.storage[selectedStorage]}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {product.storage.map((s, i) => (
              <button key={i} onClick={() => setSelectedStorage(i)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide border-2 transition-all ${selectedStorage === i ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-500"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

{/* DESCRIPCIÓN */}
<div className="mb-6 max-w-sm">
  <div 
    className="text-zinc-500 text-sm leading-7 line-clamp-3"
    dangerouslySetInnerHTML={{ 
      __html: DOMPurify.sanitize(product.description, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'mark', 'span'],
        ALLOWED_ATTR: ['class', 'style']
      })
    }} 
  />
</div>

      {/* BOTONES */}
<button
  onClick={handleAddWithAuth}
  disabled={
    product.status === "out_of_stock" ||
    (product.variants?.length > 0 && !selectedVariant) ||
    (selectedVariant && selectedVariant.stock === 0)
  }
  className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-full font-bold text-sm uppercase tracking-widest mb-3 transition-all duration-300 ${
    product.status === "out_of_stock" || (selectedVariant && selectedVariant.stock === 0)
      ? "bg-zinc-300 text-white cursor-not-allowed"
      : product.variants?.length > 0 && !selectedVariant
      ? "bg-zinc-200 text-zinc-500 cursor-not-allowed"
      : added
      ? "bg-green-600 text-white"
      : "bg-zinc-900 text-white hover:bg-zinc-700"
  }`}
>
  {added ? <Check size={16} /> : <ShoppingCart size={16} />}
  {product.variants?.length > 0 && !selectedVariant
    ? "Selecciona una talla"
    : added
    ? "¡Agregado al carrito!"
    : "Agregar al carrito"
  }
</button>

      <button className="w-full py-4 rounded-full font-bold text-sm uppercase tracking-widest border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-100 mb-10">
        Comprar ahora
      </button>

      {/* ICONOS */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[{ icon: Truck, label: "Envío gratis", sub: "24 – 48 horas" },
          { icon: Shield, label: "Garantía", sub: "12 meses" },
          { icon: RotateCcw, label: "Devolución", sub: "30 días gratis" }
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex flex-col items-center text-center gap-1.5 bg-zinc-50 rounded-2xl py-4 px-2">
            <Icon size={18} className="text-zinc-700 mb-0.5" />
            <p className="text-xs font-bold text-zinc-900">{label}</p>
            <p className="text-xs text-zinc-400">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductInfo;