"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { fetchWishlist, addToWishlist, removeFromWishlist } from "@/lib/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { token, isAuthenticated, user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // User-specific key for localStorage
  const wishlistKey = user?._id ? `wishlist_${user._id}` : "wishlist_guest";

  useEffect(() => {
    const syncWishlist = async () => {
      if (isAuthenticated && token) {
        try {
          setIsSyncing(true);
          const data = await fetchWishlist(token);
          setWishlistItems(data.items || []);
        } catch (err) {
          console.error("Failed to sync wishlist:", err);
        } finally {
          setIsSyncing(false);
        }
      } else {
        const saved = localStorage.getItem(wishlistKey);
        if (saved) {
          setWishlistItems(JSON.parse(saved));
        } else {
          setWishlistItems([]);
        }
      }
      setIsLoaded(true);
    };
    syncWishlist();
  }, [token, isAuthenticated]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(wishlistKey, JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, wishlistKey, isLoaded]);

  const toggleWishlist = async (product) => {
    const exists = wishlistItems.find((item) => item.slug === product.slug);
    
    // Update local state immediately for snappy UI
    if (exists) {
      setWishlistItems(prev => prev.filter(item => item.slug !== product.slug));
    } else {
      setWishlistItems(prev => [...prev, product]);
    }

    // Sync with backend if logged in
    if (isAuthenticated && token) {
      try {
        if (exists) {
          await removeFromWishlist(token, product.slug);
        } else {
          // Normalize for backend which expects 'image' string, not 'images' array
          await addToWishlist(token, {
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || product.image
          });
        }
      } catch (err) {
        console.error("Failed to sync wishlist action:", err);
        // Rollback on error
        if (exists) {
          setWishlistItems(prev => [...prev, product]);
        } else {
          setWishlistItems(prev => prev.filter(item => item.slug !== product.slug));
        }
      }
    }
  };

  const isInWishlist = (slug) => {
    return wishlistItems.some((item) => item.slug === slug);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
