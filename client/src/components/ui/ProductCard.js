"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, IndianRupee, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group animate-reveal"
    >
      <div className="block relative aspect-square md:aspect-[4/5] bg-white overflow-hidden mb-4 md:mb-8 rounded-sm border border-slate-200">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-contain p-4 md:p-12 transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 md:top-6 md:right-6">
          <div className="px-1.5 py-0.5 md:px-3 md:py-1 bg-white/90 backdrop-blur-md border border-slate-200 text-[7px] md:text-[9px] font-black uppercase tracking-widest text-slate-600">
            {product.category.replace("-", " ")}
          </div>
        </div>
        <button 
          onClick={handleAddToCart}
          className="absolute top-2 left-2 md:top-6 md:left-6 w-8 h-8 md:w-12 md:h-12 bg-white/90 backdrop-blur-md border border-slate-200 flex items-center justify-center rounded-full text-brand-blue hover:bg-brand hover:text-white hover:border-brand transition-all shadow-sm group/cart"
        >
          <ShoppingBag size={18} className="transition-transform group-hover/cart:scale-110" />
        </button>
      </div>

      <div className="space-y-2 md:space-y-4 px-1 md:px-2">
        <h3 className="text-xs md:text-lg font-black text-brand-blue leading-tight uppercase tracking-tight line-clamp-2 md:line-clamp-none">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-0.5 md:gap-1 text-brand font-black text-xl md:text-3xl">
          <IndianRupee size={16} strokeWidth={4} className="md:w-[24px] md:h-[24px]" />
          <span>{product.price?.toLocaleString("en-IN")}</span>
        </div>

        <div className="pt-3 md:pt-6 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-500 group-hover:text-brand transition-colors">
            View Details
          </span>
          <div className="w-6 h-6 md:w-10 md:h-10 bg-slate-100 text-brand-blue flex items-center justify-center rounded-sm transition-colors group-hover:bg-brand group-hover:text-white">
            <ArrowRight size={12} className="md:w-[16px] md:h-[16px]" />
          </div>
        </div>
      </div>
    </Link>
  );
}
