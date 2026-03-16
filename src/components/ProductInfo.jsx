import { ShoppingCart, Check, Star, Truck, Shield, RotateCcw } from "lucide-react";

const ProductInfo = ({ product, selectedColor, setSelectedColor, selectedStorage, setSelectedStorage, added, handleAdd }) => {
  return (
    <div className="flex flex-col pt-2 w-full pr-0 md:pr-11 lg:pr-11">
      <p className="text-xs tracking-widest uppercase text-zinc-400 mb-2 font-semibold">{product.brand}</p>
      <h1 className="impact text-5xl lg:text-6xl text-zinc-900 leading-none mb-4">{product.name}</h1>

      <div className="flex items-center gap-2 mb-5">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-zinc-900 text-zinc-900" />)}
        </div>
        <span className="text-zinc-400 text-xs">4.9 · 238 reseñas</span>
      </div>

      <div className="flex items-baseline gap-3 mb-8">
        <span className="text-4xl font-bold text-zinc-900">
          ${product.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
        </span>
        {product.tag === "OFERTA" && (
          <span className="text-zinc-400 line-through text-xl">${(product.price * 1.25).toFixed(2)}</span>
        )}
      </div>

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
                style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
      )}

      {product.storage?.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-bold tracking-widest uppercase text-zinc-500">Almacenamiento</p>
            <p className="text-xs font-semibold text-zinc-900">{product.storage[selectedStorage]}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {product.storage.map((s, i) => (
              <button key={i} onClick={() => setSelectedStorage(i)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide border-2 transition-all ${selectedStorage === i ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-500"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-zinc-500 text-sm leading-7 mb-8 max-w-sm">{product.description}</p>

      <button onClick={handleAdd}
        className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 mb-3 ${added ? "bg-green-600 text-white" : "bg-zinc-900 text-white hover:bg-zinc-700"}`}>
        {added ? <Check size={16} /> : <ShoppingCart size={16} />}
        {added ? "¡Agregado al carrito!" : "Agregar al carrito"}
      </button>
      <button className="w-full py-4 rounded-full font-bold text-sm uppercase tracking-widest border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-100 transition-colors mb-10">
        Comprar ahora
      </button>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { icon: Truck,     label: "Envío gratis", sub: "24 – 48 horas" },
          { icon: Shield,    label: "Garantía",     sub: "12 meses" },
          { icon: RotateCcw, label: "Devolución",   sub: "30 días gratis" },
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