"use client";

import { useState, useEffect } from "react";
import { fetchCategories } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import SectionHeader from "@/components/ui/SectionHeader";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, LayoutGrid, Layers } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState(CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        if (data && data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="container-wide">
        <SectionHeader 
          badge="Our Collections"
          title={<>EXPLORE BY <span className="text-brand">CATEGORY.</span></>}
          description="Find the perfect appliances for your kitchen, organized by category for your convenience."
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-brand" size={40} />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Categories...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {categories.map((category, idx) => (
              <Link
                key={category.slug || category._id}
                href={`/categories/${category.slug}`}
                className="group relative bg-white border border-slate-100 rounded-sm overflow-hidden hover:shadow-2xl hover:border-brand transition-all duration-500 flex flex-col h-full animate-reveal"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="aspect-[16/9] bg-slate-50 relative overflow-hidden">
                  {category.image ? (
                    <Image 
                      src={category.image} 
                      alt={category.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <Layers size={80} strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  
                  <div className="absolute bottom-6 left-6">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md text-white flex items-center justify-center rounded-sm mb-3">
                      <LayoutGrid size={20} />
                    </div>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-black text-brand-blue uppercase tracking-tight mb-4 group-hover:text-brand transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium line-clamp-3">
                    {category.description || "Premium collection of smart kitchen appliances designed for the modern lifestyle."}
                  </p>
                  <div className="flex items-center gap-2 text-brand font-black text-[10px] uppercase tracking-widest mt-auto">
                    View Collection <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
