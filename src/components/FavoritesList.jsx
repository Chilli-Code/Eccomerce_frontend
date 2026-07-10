import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const BG_COLORS = ["#f5f5f5", "#e8e4de", "#1c1c1e", "#d6e4f0", "#e8f4e8", "#2c2c2e"];

export default function FavoritesList({ user, onBack, hideTitle }) {
  const navigate = useNavigate();
  const { wishlist, loading, removeFromWishlist, loadWishlist } = useWishlist();
  const { addItem } = useCart();

  useEffect(() => {
    if (user?.id) {
      loadWishlist();
    }
  }, [user]);

  const handleRemove = async (productId, e) => {
    e.stopPropagation();
    await removeFromWishlist(productId);
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addItem(product);
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <Heart size={48} className="mx-auto text-zinc-300 mb-4" />
        <p className="text-zinc-500">Inicia sesión para ver tus productos favoritos</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart size={48} className="mx-auto text-zinc-300 mb-4" />
        <p className="text-zinc-500 mb-2">No tienes productos favoritos</p>
        <button
          onClick={() => navigate("/products")}
          className="text-sm text-zinc-900 underline"
        >
          Explorar productos
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!hideTitle && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-zinc-900">Mis favoritos</h3>
          <span className="text-xs text-zinc-400">{wishlist.length} productos</span>
        </div>
      )}
      
      <div className="space-y-3">
        {wishlist.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => navigate(`/producto/${item.product.id}`)}
            className="flex gap-3 p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 cursor-pointer transition-colors"
          >
            {/* Imagen */}
            <div
              className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden"
              style={{ backgroundColor: item.product.bgColor || BG_COLORS[idx % BG_COLORS.length] }}
            >
              <img
                src={item.product.images?.[0] || "https://placehold.co/600x750?text=Sin+imagen"}
                alt={item.product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-400 uppercase tracking-wider">
                {item.product.brand || "Marca"}
              </p>
              <p className="text-sm font-semibold text-zinc-900 line-clamp-2">
                {item.product.name}
              </p>
              <p className="text-sm font-bold text-zinc-900 mt-1">
                ${Number(item.product.price).toLocaleString("es-CO")}
              </p>
            </div>
            
            {/* Botones */}
            <div className="flex flex-col gap-2">
              <button
                onClick={(e) => handleAddToCart(item.product, e)}
                className="p-2 rounded-full bg-zinc-900 text-white hover:bg-zinc-700 transition-colors"
              >
                <ShoppingCart size={16} />
              </button>
              <button
                onClick={(e) => handleRemove(item.product.id, e)}
                className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}