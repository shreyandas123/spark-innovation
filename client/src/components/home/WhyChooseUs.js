"use client";

import { ShieldCheck, Wrench, Clock, HeartHandshake } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const features = [
  { icon: ShieldCheck, title: "100% GENUINE", description: "Official Kutchina warranty." },
  { icon: HeartHandshake, title: "EXPERT ADVICE", description: "Guidance for every kitchen." },
  { icon: Wrench, title: "QUICK INSTALL", description: "Trained professionals." },
  { icon: Clock, title: "24/7 SUPPORT", description: "Dedicated helpdesk." },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-white border-t border-slate-200">
      <div className="container-wide">
        <div className="grid lg:grid-cols-12 gap-12 md:gap-16">
          <div className="lg:col-span-5">
            <SectionHeader 
              badge="Why Choose Us"
              title={<>BEYOND <br className="hidden md:block" /><span className="text-brand">SALES.</span></>}
              description="We deliver trust, quality, and an unmatched customer experience."
              className="mb-8 md:mb-0"
            />
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-2 gap-x-4 md:gap-x-12 gap-y-8 md:gap-y-16">
            {features.map((feature) => {
              const IconComp = feature.icon;
              return (
                <div key={feature.title} className="group flex flex-col md:flex-row gap-4 md:gap-6 animate-reveal">
                  <div className="shrink-0 w-10 h-10 md:w-14 md:h-14 bg-slate-100 border border-slate-200 flex items-center justify-center rounded-sm group-hover:bg-brand group-hover:text-white transition-all duration-300">
                    <IconComp size={18} className="text-brand md:w-[24px] md:h-[24px] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-[8px] md:text-[10px] font-black text-brand-blue uppercase tracking-widest mb-1 md:mb-2 group-hover:text-brand transition-colors duration-300">{feature.title}</h3>
                    <p className="text-slate-500 text-[10px] md:text-sm leading-relaxed font-medium">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

