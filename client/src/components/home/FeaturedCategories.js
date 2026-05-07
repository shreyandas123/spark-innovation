"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
              <div key={i} className="aspect-video bg-slate-50 animate-pulse rounded-lg"></div>
            ))
          ) : (
            categories.map((category, idx) => (
              <Link
                href={`/categories/${category.slug}`}
                key={category.slug || category._id}
                className={`group relative bg-white border border-slate-100 p-8 rounded-lg hover:shadow-lg hover:border-brand transition-all animate-reveal delay-${(idx + 1) * 100}`}
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-brand-blue uppercase tracking-tight group-hover:text-brand transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-widest pt-4">
                    View Products <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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





