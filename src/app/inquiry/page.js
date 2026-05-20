"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { useSettings } from "@/contexts/SettingsContext";
import InquiryForm from "@/components/ui/InquiryForm";

export default function InquiryPage() {
  const { settings } = useSettings();
  return (
    <main className="min-h-screen bg-white">
      <div className="pt-32 pb-20">
        <div className="container-wide">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              
              <div className="space-y-10">
                <div>
                  <h1 className="text-4xl md:text-6xl font-black text-brand-blue uppercase tracking-tighter leading-none mb-6">
                    Connect with <span className="text-brand">Spark</span>
                  </h1>
                  <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-md">
                    Looking for a bulk order or a custom kitchen solution? Our experts are ready to help you innovate your kitchen space.
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="flex items-start gap-6 group">
                    <div className="w-12 h-12 bg-slate-50 rounded-sm flex items-center justify-center text-brand shrink-0 group-hover:bg-brand group-hover:text-white transition-all duration-300">
                      <Phone size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Call Us</p>
                      <p className="text-xl font-black text-brand-blue">{settings?.phone || SITE_CONFIG.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-12 h-12 bg-slate-50 rounded-sm flex items-center justify-center text-brand shrink-0 group-hover:bg-brand group-hover:text-white transition-all duration-300">
                      <Mail size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Email Us</p>
                      <p className="text-xl font-black text-brand-blue">{settings?.email || SITE_CONFIG.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-12 h-12 bg-slate-50 rounded-sm flex items-center justify-center text-brand shrink-0 group-hover:bg-brand group-hover:text-white transition-all duration-300">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Visit Us</p>
                      <p className="text-xl font-black text-brand-blue">{settings?.address || SITE_CONFIG.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-100 shadow-2xl rounded-sm p-8 md:p-12 relative overflow-hidden">
                <InquiryForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
