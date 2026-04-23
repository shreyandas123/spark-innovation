"use client";

import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import SectionHeader from "@/components/ui/SectionHeader";

export default function FeaturedCategories() {
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="container-wide">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <SectionHeader 
            badge="Product Range"
            title={<>DESIGNED FOR <br className="hidden md:block" /><span className="text-brand underline decoration-brand/20 underline-offset-8 uppercase">INDIAN</span> KITCHENS.</>}
            description="Our collection of modular appliances is crafted to fit seamlessly into your lifestyle."
            className="mb-0"
          />
          <div className="hidden md:flex items-center gap-3 text-brand-blue font-black uppercase tracking-widest text-[10px] cursor-pointer group opacity-60 hover:opacity-100 transition-opacity">
            Full Catalog
            <div className="w-10 h-10 border border-slate-200 flex items-center justify-center rounded-full group-hover:bg-brand group-hover:text-white transition-all">
              <ArrowRight size={14} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-1 bg-slate-100 border border-slate-200">
          {CATEGORIES.map((category) => (
            <div
              key={category.slug}
              className="group relative h-48 md:h-80 bg-white overflow-hidden p-6 md:p-10 flex flex-col justify-between cursor-pointer"
            >
              <div className="absolute top-0 left-0 w-[2px] h-0 bg-brand group-hover:h-full transition-all duration-500"></div>
              
              <div className="relative z-10">
                <span className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">
                  Category
                </span>
                <h3 className="text-xl md:text-4xl font-black text-brand-blue mt-2 md:mt-4 leading-none uppercase tracking-tighter group-hover:text-brand transition-colors">
                  {category.name}
                </h3>
              </div>
              
              <div className="relative z-10">
                <p className="hidden md:block text-slate-600 text-sm font-medium mb-8 line-clamp-2">
                  {category.description}
                </p>
                <div className="flex items-center gap-2 text-brand-blue font-black text-[7px] md:text-[9px] uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-all">
                  Browse <ArrowRight size={10} className="md:w-[12px] md:h-[12px]" />
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 md:-bottom-10 md:-right-10 text-brand-blue/5 font-black text-7xl md:text-[12rem] leading-none select-none transition-transform duration-700 group-hover:scale-110 group-hover:-translate-x-2">
                {category.name.charAt(0)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

