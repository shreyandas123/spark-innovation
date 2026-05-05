"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const HERO_SLIDES = [
  {
    id: 1,
    title: "Beyond Purification",
    subtitle: "Advanced Water Healthifier",
    image: "/images/hero/purifier.png",
  },
  {
    id: 2,
    title: "i-Auto Clean Technology",
    subtitle: "Modern Smart Chimneys",
    image: "/images/hero/chimney.png",
  },
  {
    id: 3,
    title: "Modular Elegance",
    subtitle: "Bespoke Kitchen Solutions",
    image: "/images/hero/hob.png",
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative w-full min-h-[70vh] md:h-[85vh] bg-[#fcfcfc] overflow-hidden flex items-center">
      {}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 skew-x-12 translate-x-20 hidden lg:block" />
      
      <div className="container-wide relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {}
          <div className="space-y-6 md:space-y-10 animate-reveal text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-brand/5 border border-brand/10 rounded-full animate-reveal delay-100 mx-auto lg:mx-0">
                <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand">
                  {HERO_SLIDES[currentSlide].subtitle}
                </span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-brand-blue leading-[1.1] tracking-tight animate-reveal delay-200">
                {HERO_SLIDES[currentSlide].title.split(' ').map((word, i) => (
                  <span key={i} className={i === 1 ? "text-brand" : ""}>
                    {word}{' '}
                  </span>
                ))}
              </h1>
              <p className="text-slate-500 text-sm md:text-lg font-medium max-w-lg mx-auto lg:mx-0 animate-reveal delay-300 leading-relaxed">
                Elevate your culinary experience with smart technology and timeless design. Authorized Kutchina excellence for your home.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-reveal delay-400">
              <button className="w-full sm:w-auto px-10 py-4 bg-brand-blue text-white font-black uppercase tracking-widest text-[10px] rounded-sm hover:bg-brand transition-all shadow-xl shadow-brand-blue/10 active:scale-95">
                Explore Collection
              </button>
              <button className="w-full sm:w-auto px-10 py-4 bg-white border border-slate-200 text-brand-blue font-black uppercase tracking-widest text-[10px] rounded-sm hover:bg-slate-50 transition-all active:scale-95">
                View Catalog
              </button>
            </div>

            {}
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white" />)}
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="text-brand-blue font-black">2k+</span> Happy Homes
                </p>
              </div>
            </div>
          </div>

          {}
          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-square w-full max-w-md md:max-w-xl mx-auto animate-reveal delay-500">
              {}
              <div className="absolute inset-0 bg-brand/5 rounded-full blur-3xl scale-75 animate-pulse" />
              
              <Image 
                key={HERO_SLIDES[currentSlide].id}
                src={HERO_SLIDES[currentSlide].image} 
                alt={HERO_SLIDES[currentSlide].title} 
                fill 
                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-1000 ease-in-out hover:scale-105"
                priority
              />
            </div>

            {}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-slate-100 rounded-full scale-125 opacity-20 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-slate-100 rounded-full scale-150 opacity-10 pointer-events-none" />
          </div>

        </div>
      </div>

      {}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        {HERO_SLIDES.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              idx === currentSlide ? 'w-10 bg-brand shadow-lg shadow-brand/20' : 'w-2 bg-slate-200 hover:bg-slate-300'
            }`}
          />
        ))}
      </div>

      {}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 hidden xl:flex flex-col gap-6">
        <button onClick={prevSlide} className="w-12 h-12 border border-slate-200 flex items-center justify-center rounded-full text-slate-300 hover:border-brand hover:text-brand transition-all">
          <ChevronLeft size={20} />
        </button>
        <button onClick={nextSlide} className="w-12 h-12 border border-slate-200 flex items-center justify-center rounded-full text-slate-300 hover:border-brand hover:text-brand transition-all">
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
