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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20 border-b border-slate-100 pb-12">
          <SectionHeader 
            badge="Personal Collection"
            title={<>MY <span className="text-brand">WISHLIST.</span></>}
            description="Your curated selection of premium kitchen innovations."
            className="mb-0"
          />
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleMoveAllToCart}
              className="px-6 py-4 bg-brand text-white font-black uppercase tracking-widest text-[10px] rounded-sm hover:bg-brand-dark transition-all flex items-center gap-2 shadow-xl shadow-brand/10"
            >
              <ShoppingBag size={14} />
              Move All to Bag
            </button>
            <button 
              onClick={() => {
                if (confirm("Clear your entire wishlist?")) clearWishlist();
              }}
              className="px-6 py-4 bg-white border border-slate-200 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-sm hover:text-red-500 hover:border-red-100 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-16">
          {wishlistItems.map((product) => (
            <div key={product.slug} className="flex flex-col h-full bg-white group text-center lg:text-left">
              <Link href={`/products/${product.slug}`} className="block aspect-4/5 relative bg-slate-50 rounded-sm overflow-hidden mb-5">
                <Image
                  src={product.images?.[0] || product.image || "/images/placeholder-product.svg"}
                  alt={product.name}
                  fill
                  className="object-contain p-6"
                />
              </Link>

              <div className="flex-1 space-y-1.5 mb-5">
                <p className="text-[9px] font-bold text-brand uppercase tracking-[0.2em] opacity-60">
                  {product.category?.replace(/-/g, " ")}
                </p>
                <h3 className="text-[13px] font-black text-brand-blue uppercase tracking-tight leading-tight line-clamp-2 min-h-[2.5em]">
                  {product.name}
                </h3>
                <div className="flex items-center justify-center lg:justify-start gap-0.5 text-brand-blue font-black text-lg">
                  <IndianRupee size={14} strokeWidth={4} />
                  <span>{product.price?.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => addToCart(product)}
                  className="flex-1 py-3.5 bg-brand-blue text-white font-black uppercase tracking-widest text-[9px] rounded-sm hover:bg-brand transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag size={13} />
                  <span>Bag</span>
                </button>
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="w-12 py-3.5 bg-slate-50 border border-slate-100 text-slate-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all flex items-center justify-center rounded-sm"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
