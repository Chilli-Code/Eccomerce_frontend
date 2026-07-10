import { createContext, useContext, useState, useEffect } from "react";
import { wishlistApi } from "../lib/api";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};

export function WishlistProvider({ children, user }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Cargar wishlist cuando el usuario cambia
  useEffect(() => {
    if (user?.id) {
      loadWishlist();
    } else {
      setWishlist([]);
      setInitialized(true);
    }
  }, [user]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishlistApi.list();
      setWishlist(data);
    } catch (err) {
      console.error("Error loading wishlist:", err);
      setWishlist([]);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      setLoading(true);
      await wishlistApi.add(productId);
      // Recargar la lista completa
      await loadWishlist();
      return true;
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      setLoading(true);
      await wishlistApi.remove(productId);
      // Actualizar estado local
      setWishlist(prev => prev.filter(item => item.productId !== productId));
      return true;
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    if (!initialized) return false;
    return wishlist.some(item => item.productId === productId);
  };

  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      loading,
      initialized,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      loadWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}