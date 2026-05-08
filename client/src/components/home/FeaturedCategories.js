"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Layers } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { fetchCategories } from "@/lib/api";
import SectionHeader from "@/components/ui/SectionHeader";

export default function FeaturedCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        if (data && data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        } else {
          setCategories(CATEGORIES);
        }
      } catch (error) {
        setCategories(CATEGORIES);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <SectionHeader 
          badge="Categories"
          title="Explore Our Collection"
          description="Browse through our wide range of premium kitchen appliances."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-slate-50 animate-pulse rounded-sm"></div>
            ))
          ) : (
            categories.map((category, idx) => (
              <Link
                href={`/categories/${category.slug}`}
                key={category.slug || category._id}
                className={`group relative bg-white border border-slate-100 rounded-sm overflow-hidden hover:shadow-xl hover:border-brand transition-all animate-reveal delay-${(idx + 1) * 100}`}
              >
                <div className="aspect-[16/10] bg-slate-50 relative overflow-hidden">
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
                      <Layers size={64} strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/80 via-brand-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="p-8 space-y-4">
                  <h3 className="text-xl font-black text-brand-blue uppercase tracking-tight group-hover:text-brand transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                    {category.description || "Premium Kutchina appliances for your modern kitchen."}
                  </p>
                  <div className="flex items-center gap-2 text-brand font-black text-[10px] uppercase tracking-widest pt-2">
                    View Collection <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}





