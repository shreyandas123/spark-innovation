"use client";

import { ArrowRight, Play } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-white overflow-hidden min-h-[90vh] flex items-center">
      <div className="container-wide relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 animate-reveal">
            <div className="inline-flex items-center gap-3 mb-6 md:mb-8">
              <span className="w-8 md:w-12 h-[2px] bg-brand"></span>
              <span className="text-brand font-black uppercase tracking-[0.3em] text-[8px] md:text-[10px]">
                Kutchina Platinum Partner
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-black text-brand-blue mb-6 md:mb-8 leading-[0.9] tracking-tighter">
              KITCHEN <br />
              <span className="text-brand">FUTURE</span> <br />
              DEFINED.
            </h1>
            
            <p className="text-slate-600 font-medium text-base md:text-xl max-w-xl mb-8 md:mb-12 leading-relaxed">
              Experience India&apos;s first i-Auto Clean technology. 
              Smart appliances designed for the soulful Indian kitchen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <div className="px-8 md:px-12 py-4 md:py-5 bg-brand hover:bg-brand-dark text-white font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px] rounded-sm cursor-pointer transition-all flex items-center justify-center shadow-xl shadow-brand/20 hover:shadow-brand/40 group">
                Explore Catalog 
                <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
              </div>
              <div className="px-8 md:px-12 py-4 md:py-5 border border-brand-blue/20 hover:border-brand-blue text-brand-blue font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px] rounded-sm cursor-pointer transition-all flex items-center justify-center group">
                <div className="w-5 h-5 bg-brand-blue/10 rounded-full flex items-center justify-center mr-2 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                  <Play size={10} fill="currentColor" />
                </div>
                Inquire Now
              </div>
            </div>

            <div className="mt-12 md:mt-16 grid grid-cols-3 gap-4 md:gap-8 border-t border-slate-200 pt-8 md:pt-10">
              <div>
                <p className="text-xl md:text-3xl font-black text-brand-blue">20+</p>
                <p className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Years of Trust</p>
              </div>
              <div>
                <p className="text-xl md:text-3xl font-black text-brand-blue">100%</p>
                <p className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Auto Clean</p>
              </div>
              <div>
                <p className="text-xl md:text-3xl font-black text-brand-blue">Expert</p>
                <p className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Installation</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex items-center justify-center mt-12 lg:mt-0">
            <div className="relative w-full aspect-square md:aspect-[4/5] bg-slate-100 rounded-lg overflow-hidden shadow-2xl animate-reveal delay-200 border border-slate-200 group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale scale-110 transition-transform duration-[2s] group-hover:scale-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/70 via-brand-blue/10 to-transparent opacity-80" />
              
              <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10">
                <div className="p-4 md:p-6 bg-white/70 backdrop-blur-xl border border-white/40 rounded-sm">
                  <p className="text-brand text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1">Modern Collection</p>
                  <p className="text-brand-blue text-lg md:text-2xl font-black uppercase tracking-tighter">FLORA i-AUTO CLEAN</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

