"use client";

import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { ShoppingBag, Trash2, ArrowRight, Heart, IndianRupee } from "lucide-react";

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
        {}
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

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {wishlistItems.map((product) => (
            <div key={product.slug} className="flex flex-col h-full bg-white group">
              {}
              <Link href={`/products/${product.slug}`} className="block aspect-square relative bg-slate-50 rounded-sm overflow-hidden mb-6">
                <Image 
                  src={product.images?.[0] || product.image || "/images/placeholder-product.svg"} 
                  alt={product.name} 
                  fill 
                  className="object-contain p-8 group-hover:scale-105 transition-transform duration-500" 
                />
              </Link>

              {}
              <div className="flex-1 space-y-2 mb-6">
                <p className="text-[10px] font-black text-brand uppercase tracking-[0.2em]">
                  {product.category?.replace("-", " ")}
                </p>
                <h3 className="text-lg font-black text-brand-blue uppercase tracking-tight leading-tight">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 text-brand font-black text-xl">
                  <IndianRupee size={16} strokeWidth={4} />
                  <span>{product.price?.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {}
              <div className="grid grid-cols-1 gap-2 mt-auto">
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full py-4 bg-brand-blue text-white font-black uppercase tracking-widest text-[10px] rounded-sm hover:bg-brand transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={14} />
                  Add to Bag
                </button>
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="w-full py-4 bg-white border border-slate-100 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-sm hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} />
                  Remove from Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
