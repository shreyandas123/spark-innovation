"use client";

import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProductCard from "@/components/ui/ProductCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { Heart, ShoppingBag, Trash2, ArrowRight, Ghost } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlistItems, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login?redirect=/wishlist");
    }
  }, [loading, isAuthenticated, router]);

  const handleMoveAllToCart = () => {
    if (confirm("Move all items to bag?")) {
      wishlistItems.forEach(item => addToCart(item));
      clearWishlist();
      router.push("/cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center pt-20">
        <div className="container-wide text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
            <Heart size={48} />
          </div>
          <h1 className="text-4xl font-black text-brand-blue uppercase tracking-tight mb-4">Your Wishlist is Empty</h1>
          <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed font-medium">
            Looks like you haven&apos;t saved any products yet. Explore our collection and save your favorites!
          </p>
          <Link 
            href="/products" 
            className="inline-flex items-center gap-3 bg-brand-blue text-white py-4 px-10 rounded-sm font-black uppercase tracking-widest text-[10px] hover:bg-brand transition-all shadow-lg group"
          >
            Start Shopping
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 bg-white">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 border-b border-slate-100 pb-12">
          <SectionHeader 
            badge="My Collection"
            title={<>SAVED <span className="text-brand">ITEMS.</span></>}
            description="Your personal curated list of premium kitchen appliances."
            className="mb-0"
          />
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleMoveAllToCart}
              className="px-8 py-4 bg-brand text-white font-black uppercase tracking-widest text-[10px] rounded-sm hover:bg-brand-dark transition-all shadow-xl shadow-brand/20 flex items-center gap-2"
            >
              <ShoppingBag size={14} />
              Move All to Bag
            </button>
            <button 
              onClick={() => {
                if (confirm("Clear your entire wishlist?")) clearWishlist();
              }}
              className="px-8 py-4 bg-white border border-slate-200 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-sm hover:text-red-500 hover:border-red-100 transition-all"
            >
              <Trash2 size={14} />
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {wishlistItems.map((product) => (
            <div key={product.slug} className="group relative">
              <ProductCard product={product} />
              {}
              <button 
                onClick={() => toggleWishlist(product)}
                className="absolute top-4 right-4 w-10 h-10 bg-white shadow-lg text-slate-400 hover:text-red-500 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 border border-slate-100"
                title="Remove from wishlist"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
