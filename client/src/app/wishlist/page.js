"use client";

import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { Heart, ShoppingBag, Trash2, ArrowRight, Ghost, Sparkles, MoveRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function WishlistPage() {
  const { wishlistItems, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login?redirect=/wishlist");
    }
    if (!loading) setIsLoaded(true);
  }, [loading, isAuthenticated, router]);

  const handleMoveAllToCart = () => {
    wishlistItems.forEach(item => addToCart(item));
    if (confirm("Move all items to bag and clear wishlist?")) {
      clearWishlist();
      router.push("/cart");
    }
  };

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-slate-100 border-t-brand rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Collection</p>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 pt-32 pb-20 overflow-hidden">
        {}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-slate-50/50 -skew-y-6 -translate-y-1/2 pointer-events-none" />
        
        <div className="relative z-10 text-center animate-reveal">
          <div className="w-32 h-32 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-full flex items-center justify-center mx-auto mb-10 group">
            <Heart size={40} className="text-slate-200 group-hover:text-brand transition-colors duration-500 group-hover:scale-110" />
          </div>
          
          <div className="space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/5 border border-brand/10 rounded-sm mb-2">
              <Sparkles size={10} className="text-brand" />
              <span className="text-[9px] font-black uppercase tracking-widest text-brand">Your Curated List</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-brand-blue uppercase tracking-tighter leading-none">
              Empty <span className="text-slate-300">Sanctuary.</span>
            </h1>
            <p className="text-slate-500 max-w-sm mx-auto text-sm md:text-base font-medium leading-relaxed">
              Your wishlist is currently a blank canvas. Start exploring our premium collection and save what inspires you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/products" 
              className="w-full sm:w-auto px-12 py-5 bg-brand-blue text-white font-black uppercase tracking-widest text-[10px] rounded-sm hover:bg-brand transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-blue/10 active:scale-95"
            >
              Explore Collection
              <MoveRight size={14} />
            </Link>
            <Link 
              href="/" 
              className="w-full sm:w-auto px-12 py-5 bg-white border border-slate-200 text-brand-blue font-black uppercase tracking-widest text-[10px] rounded-sm hover:bg-slate-50 transition-all active:scale-95"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      {}
      <div className="absolute top-0 right-0 w-1/3 h-screen bg-slate-50/50 skew-x-6 translate-x-20 pointer-events-none -z-10" />
      
      <div className="container-wide">
        {}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-20 animate-reveal">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-[1px] bg-brand" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand">Personal Sanctuary</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-brand-blue uppercase tracking-tighter leading-none">
              My <span className="text-brand">Wishlist.</span>
            </h1>
            <p className="text-slate-400 font-medium text-sm md:text-lg max-w-xl">
              A curated collection of your most-desired premium appliances, saved for the perfect moment.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={handleMoveAllToCart}
              className="px-8 py-4 bg-brand-blue text-white font-black uppercase tracking-widest text-[10px] rounded-sm hover:bg-brand transition-all flex items-center gap-3 shadow-lg shadow-brand-blue/10 active:scale-95"
            >
              <ShoppingBag size={14} />
              Move All to Bag
            </button>
            <button 
              onClick={() => {
                if (confirm("Are you sure you want to clear your collection?")) clearWishlist();
              }}
              className="px-8 py-4 bg-white border border-slate-200 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-sm hover:text-red-500 hover:border-red-100 transition-all active:scale-95"
            >
              Clear Sanctuary
            </button>
          </div>
        </div>

        {}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12 lg:gap-16">
          {wishlistItems.map((product, idx) => (
            <div 
              key={product.slug || product._id} 
              className={`group relative animate-reveal`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <ProductCard product={product} />
              
              {}
              <div className="absolute top-4 left-4 z-20">
                <div className="w-8 h-8 bg-white border border-slate-100 flex items-center justify-center rounded-sm text-[10px] font-black text-slate-300">
                  0{idx + 1}
                </div>
              </div>

              {}
              <button 
                onClick={() => toggleWishlist(product)}
                className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white shadow-xl shadow-red-500/20 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 z-20 translate-y-2 group-hover:translate-y-0"
                title="Remove from collection"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {}
        <div className="mt-32 pt-20 border-t border-slate-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-md text-center md:text-left">
              <h3 className="text-2xl font-black text-brand-blue uppercase tracking-tight mb-4">Ready to elevate your home?</h3>
              <p className="text-slate-400 font-medium text-sm leading-relaxed">
                Complete your selection today and experience the future of smart kitchen technology with Spark Innovations.
              </p>
            </div>
            <Link 
              href="/cart"
              className="group flex items-center gap-6 text-brand font-black uppercase tracking-[0.3em] text-[11px] hover:gap-10 transition-all"
            >
              Proceed to Bag
              <MoveRight size={24} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
