"use client";

import { Bell, ArrowUpRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export default function CTASection() {
  return (
    <section id="inquiry" className="section-padding bg-white text-brand-blue relative overflow-hidden border-t border-slate-200">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)`,
             backgroundSize: '40px 40px' 
           }} />
      
      <div className="container-wide relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 md:p-16 bg-white border border-slate-200 rounded-sm text-center">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand/40" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-brand/40" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-brand/40" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand/40" />

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/10 border border-brand/20 rounded-sm mb-6">
              <Bell size={10} className="text-brand" />
              <span className="text-brand font-black uppercase tracking-[0.3em] text-[8px] md:text-[9px]">
                Coming Soon
              </span>
            </div>

            <h2 className="text-3xl md:text-6xl lg:text-7xl font-black uppercase leading-tight md:leading-[0.9] tracking-tighter mb-6 md:mb-8">
              UPGRADE YOUR <br />
              <span className="text-brand italic">KITCHEN</span> SOON.
            </h2>

            <p className="text-slate-600 font-medium text-sm md:text-xl max-w-xl mx-auto mb-10 md:mb-14 leading-relaxed">
              We are currently updating our digital catalog. Direct inquiries and showroom visits 
              remain active for all Kutchina smart appliances.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="p-4 bg-slate-100 border border-slate-200 rounded-sm flex flex-col items-center justify-center">
                <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1">Status</span>
                <div className="flex items-center gap-2 text-brand-blue font-bold text-[10px] uppercase tracking-widest">
                  Catalog Offline <div className="w-1.5 h-1.5 bg-brand rounded-full" />
                </div>
              </div>
              
              <a 
                href={`tel:${SITE_CONFIG.phone}`}
                className="p-4 bg-brand hover:bg-brand-dark rounded-sm flex flex-col items-center justify-center transition-all shadow-lg shadow-brand/20 active:scale-95 group"
              >
                <span className="text-[7px] font-black text-white/60 uppercase tracking-widest mb-1">Call Support</span>
                <div className="flex items-center gap-2 text-white font-bold text-[10px] uppercase tracking-widest">
                  {SITE_CONFIG.phone} <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </a>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16 opacity-30 grayscale pointer-events-none">
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Kutchina</span>
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Modular</span>
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Smart</span>
          </div>
        </div>
      </div>
    </section>
  );
}






