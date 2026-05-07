"use client";

import { useState, useEffect } from "react";
import { fetchCategories } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import SectionHeader from "@/components/ui/SectionHeader";
import Link from "next/link";
import { ArrowRight, ChevronRight, LayoutGrid } from "lucide-react";
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {categories.map((category, idx) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group bg-white border border-slate-100 p-8 rounded-lg hover:shadow-2xl hover:border-brand transition-all duration-500 flex flex-col h-full relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 bg-slate-50 text-brand flex items-center justify-center rounded-sm mb-6 group-hover:bg-brand group-hover:text-white transition-colors duration-500">
                  <LayoutGrid size={24} />
                </div>
                <h3 className="text-2xl font-black text-brand-blue uppercase tracking-tight mb-4 group-hover:text-brand transition-colors">
                  {category.name}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
                  {category.description || "Premium collection of smart kitchen appliances designed for the modern lifestyle."}
                </p>
                <div className="flex items-center gap-2 text-brand font-black text-[10px] uppercase tracking-widest mt-auto">
                  View Collection <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
              
              {/* Decorative background element */}
              <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity duration-500 group-hover:scale-110 transition-transform">
                <LayoutGrid size={200} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
