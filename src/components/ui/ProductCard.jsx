import { useState } from "react";
import { ShoppingCart, Eye } from "lucide-react";
import WishlistButton from "./WishlistButton";

const ProductCard = ({
  product,
  variant = "default", 
  onView,
  onAdd,
  onAuthRequired,
  user
}) => {
  const [added, setAdded] = useState(false);

  const styles = {
    default: {
      container: "rounded-3xl mb-3",
      badge: "top-3 left-3 text-xs px-3 py-1.5",
      wishlist: "top-3 right-3",
      title: "text-2xl impact leading-none mb-1",
      brand: "text-xs mb-0.5",
      price: "text-base",
      button: "px-7 py-3 text-xs gap-2",
      overlayGap: "gap-3"
    },
    mini: {
      container: "rounded-2xl mb-2",
      badge: "top-2 left-2 text-[10px] px-2 py-1",
      wishlist: "top-1 right-1 !w-6 !h-6",
      title: "text-sm font-bold leading-tight",
      brand: "text-[10px]",
      price: "text-sm",
      button: "px-5 py-2.5 text-[11px] gap-1.5",
      overlayGap: "gap-2"
    }
  };

  const s = styles[variant];

const handleAdd = (e) => {
  e.stopPropagation();

  if (!user) {
    onAuthRequired?.();
    return;
  }

  // Si tiene variantes, NO agregar al carrito, solo redirigir
  if (product.variants && product.variants.length > 0) {
    onView?.(); // Redirigir a la página del producto
    return;
  }

  // Si no tiene variantes, agregar directamente
  setAdded(true);
  onAdd?.(product);
  setTimeout(() => setAdded(false), 1800);
};

  return (
    <div className="flex flex-col group cursor-pointer">
      {/* Imagen */}
      <div
        className={`relative w-full overflow-hidden ${s.container}`}
        style={{
          backgroundColor: product.bg || "#f5f5f5",
          aspectRatio: "4 / 5"
        }}
      >
        <img
          src={
            product.img ||
            product.images?.[0] ||
            "https://placehold.co/600x750?text=Sin+imagen"
          }
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge */}
        {(product.tag || product.badge) && (
          <span
            className={`absolute z-10 bg-white/90 backdrop-blur-sm text-zinc-900 font-semibold rounded-full ${s.badge}`}
          >
            {product.tag || product.badge}
          </span>
        )}

        {/* Wishlist */}
        <WishlistButton
        productId={product.id}
          className={`absolute z-20 ${s.wishlist}`}
           onAuthRequired={onAuthRequired}
        user={user}

        />

        {/* Hover */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center ${s.overlayGap} z-10`}
        >
<button
  onClick={handleAdd}
  disabled={product.variants && product.variants.length > 0} // 👈 Deshabilitar si tiene variantes
  className={`flex items-center font-bold uppercase tracking-widest rounded-full transition-all duration-300 ${
    added
      ? "bg-green-500 text-white scale-95"
      : product.variants && product.variants.length > 0
      ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50" // 👈 Estilo deshabilitado
      : "bg-white text-zinc-900 hover:bg-zinc-100"
  } ${s.button}`}
>
  <ShoppingCart size={variant === "mini" ? 12 : 14} />
  Agregar  {/* 👈 Siempre "Agregar" */}
</button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onView?.();
            }}
            className={`flex items-center font-bold uppercase tracking-widest rounded-full bg-zinc-900 text-white hover:bg-zinc-700 transition-colors ${s.button}`}
          >
            <Eye size={variant === "mini" ? 12 : 14} />
            {variant === "mini" ? "Ver" : "Ver producto"}
          </button>
        </div>
      </div>

      {/* Info */}
      <p
        className={`${s.brand} text-zinc-400 tracking-widest uppercase`}
      >
        {product.brand || ""}
      </p>

      <p className={`${s.title} text-zinc-900`}>
        {product.name}
      </p>

      <p className={`${s.price} text-zinc-500`}>
        ${Number(product.price).toLocaleString("es-CO", {
          minimumFractionDigits: 0
        })}
      </p>
    </div>
  );
};

export default ProductCard;