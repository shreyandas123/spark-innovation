"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { IndianRupee, ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";

export default function ProductCard({ product }) {
  if (!product) return null;
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const router = useRouter();
  const pathname = usePathname();

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${pathname}`);
      return;
    }
    toggleWishlist(product);
  };

  return (
    <div className="group relative bg-white transition-all duration-700 flex flex-col h-full rounded-sm border border-transparent hover:border-slate-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] p-2">
      <Link href={`/products/${product.slug}`} className="block aspect-[4/5] relative bg-[#f9f9f9] rounded-sm overflow-hidden group-hover:bg-[#f2f2f2] transition-colors duration-500">
        <Image 
          src={product.images?.[0] || product.image || "/images/placeholder-product.svg"} 
          alt={product.name} 
          fill 
          className="object-contain p-6 md:p-10 group-hover:scale-110 transition-transform duration-1000" 
        />
        {}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100">
          <button 
            onClick={handleWishlistClick}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
              isInWishlist(product.slug) 
                ? "bg-brand text-white shadow-lg shadow-brand/20" 
                : "bg-white text-slate-400 hover:text-brand shadow-sm"
            }`}
          >
            <Heart size={14} fill={isInWishlist(product.slug) ? "currentColor" : "none"} />
          </button>
        </div>

        {product.isNew && (
          <div className="absolute top-3 left-3">
            <span className="bg-brand-blue text-white text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">New</span>
          </div>
        )}
      </Link>

      <div className="pt-6 pb-4 px-2 flex flex-col flex-1 text-center lg:text-left">
        <div className="flex-1 space-y-2 mb-6">
          <p className="text-[9px] font-bold text-brand uppercase tracking-[0.2em] opacity-60">
            {product.category?.replace("-", " ")}
          </p>
          <h3 className="text-sm md:text-base font-semibold text-brand-blue leading-tight tracking-tight hover:text-brand transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-center lg:justify-start gap-1 text-brand-blue font-bold text-base md:text-lg">
            <IndianRupee size={14} strokeWidth={2.5} />
            <span>{product.price?.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <button 
          onClick={handleAddToCart}
          className="w-full py-3 bg-brand-blue text-white font-bold uppercase tracking-widest text-[9px] rounded-sm hover:bg-brand transition-all flex items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
        >
          <ShoppingBag size={12} />
          Add to Bag
        </button>
      </div>
    </div>
  );
}




