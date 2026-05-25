"use client";
import { Phone, Mail, ArrowUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/constants";
import { useSettings } from "@/contexts/SettingsContext";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();


  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-gradient-to-br from-brand-blue to-[#051c36] text-white pt-16 md:pt-24 pb-8 md:pb-12 relative overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand via-brand-blue to-brand" />
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
             backgroundSize: '32px 32px'
           }} />
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-20 mb-12 md:mb-24">
          
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6 md:mb-10 group cursor-default">
              <div className="w-10 h-10 relative flex items-center justify-center">
                <Image src="/favicon.ico" alt="Spark Innovations Logo" fill className="object-contain" sizes="40px" />
              </div>
              <span className="text-xl md:text-2xl font-black uppercase tracking-tighter">
                Spark <span className="text-brand">Innovations</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-6 md:mb-10">
              {SITE_CONFIG.description}
            </p>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-brand mb-6 md:mb-10">Support</h3>
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-4 md:gap-5 cursor-default">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Phone size={16} className="text-brand md:w-[18px] md:h-[18px]" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-brand/60 mb-1">Direct Call</p>
                  <p className="font-black text-white text-sm md:text-base">{settings?.phone || SITE_CONFIG.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 md:gap-5 cursor-default">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Mail size={16} className="text-brand md:w-[18px] md:h-[18px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-widest text-brand/60 mb-1">Email Inquiry</p>
                  <p className="font-black text-white text-sm md:text-base truncate">{settings?.email || SITE_CONFIG.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-brand mb-6 md:mb-10">Authorized Partner</h3>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              Spark Innovations is a certified premium distributor of Kutchina appliances. 
              Bringing world-class kitchen technology to your doorstep with expert support.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 md:pt-12 border-t border-white/10 flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-8">
          <p className="text-slate-400 text-[10px] md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-center md:text-left">
            © {currentYear} Computer Software Solutions | All Rights Reserved
          </p>
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-12">
            <div className="flex gap-6 md:gap-12">
              <Link href="/terms#privacy" className="text-slate-400 text-[10px] md:text-sm font-black uppercase tracking-[0.15em] md:tracking-[0.3em] hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms#terms" className="text-slate-400 text-[10px] md:text-sm font-black uppercase tracking-[0.15em] md:tracking-[0.3em] hover:text-white transition-colors">Terms of Service</Link>
            </div>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-10 h-10 bg-brand hover:bg-brand-dark flex items-center justify-center rounded-full transition-all duration-300 shadow-lg shadow-brand/20 group"
            >
              <ArrowUp size={16} className="text-white transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}




