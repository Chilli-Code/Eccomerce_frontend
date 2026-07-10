import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";

const WishlistButton = ({ productId, className = "", onAuthRequired, user }) => {
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const [localLoading, setLocalLoading] = useState(false);
  
  const isWishlisted = isInWishlist(productId);
  const isLoading = localLoading || wishlistLoading;

const handleWishlist = async (e) => {
  e.stopPropagation();

  console.log("🔵 WishlistButton - user:", user);
  console.log("🔵 WishlistButton - productId:", productId);

  if (!user) {
    console.log("🔴 No user, opening auth");
    onAuthRequired?.();
    return;
  }

  setLocalLoading(true);
  const result = await toggleWishlist(productId);
  console.log("🔵 Result:", result);
  setLocalLoading(false);
};
  return (
    <button
      onClick={handleWishlist}
      disabled={isLoading}
      className={`${className} w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
        isLoading ? "opacity-50 cursor-wait" : ""
      } ${
        isWishlisted
          ? "bg-red-500 text-white scale-110"
          : "bg-white/80 backdrop-blur-sm text-zinc-400 hover:text-red-400 hover:bg-white"
      }`}
    >
      <Heart size={14} className={isWishlisted ? "fill-white" : ""} />
    </button>
  );
};

export default WishlistButton;