"use client";

import { useState, useEffect } from "react";
import { Phone, Menu, X, ArrowRight, ShoppingBag, User } from "lucide-react";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/constants";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide navbar on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 md:px-8 lg:px-12 ${
        isScrolled 
          ? "pt-4" 
          : "pt-8"
      }`}
    >
      <div 
        className={`mx-auto max-w-7xl transition-all duration-500 ease-in-out border ${
          isScrolled 
            ? "bg-white/80 backdrop-blur-xl py-3 px-6 md:px-10 rounded-2xl border-white/20 shadow-2xl shadow-brand-blue/10" 
            : "bg-white/10 backdrop-blur-md py-2 px-6 md:px-10 rounded-xl border-white/10"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 bg-brand flex items-center justify-center rounded-sm transition-transform duration-500 group-hover:rotate-12">
              <span className="text-white font-black text-lg">S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-brand-blue uppercase tracking-tighter leading-none">
                Sparkel<span className="text-brand">Sales</span>
              </span>
              <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">
                Kutchina Distributor
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href || "#"}
                className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-brand-blue transition-colors duration-300 relative group py-2"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <Link href="/cart" className="relative group">
              <div className="w-10 h-10 flex items-center justify-center text-brand-blue hover:text-brand transition-colors">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white animate-reveal">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>
            <a 
              href={`tel:${SITE_CONFIG.phone}`}
              className="flex items-center gap-3 group"
            >
              <div className="w-8 h-8 bg-slate-100 border border-slate-200 flex items-center justify-center rounded-full transition-colors group-hover:border-brand/50 group-hover:bg-brand/10">
                <Phone size={12} className="text-brand-blue group-hover:text-brand transition-colors" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-blue">{SITE_CONFIG.phone}</span>
            </a>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/admin" className="flex items-center gap-2 group">
                   <div className="w-9 h-9 bg-brand-blue text-white rounded-full flex items-center justify-center border-2 border-white shadow-md">
                     <User size={16} />
                   </div>
                   <div className="hidden xl:block">
                     <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Account</p>
                     <p className="text-[10px] font-black text-brand-blue uppercase">{user?.name || 'User'}</p>
                   </div>
                </Link>
                <button 
                  onClick={logout}
                  className="text-[8px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/auth/login"
                className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-brand-blue hover:text-brand transition-colors group"
              >
                <User size={16} className="text-brand group-hover:scale-110 transition-transform" />
                Login / Register
              </Link>
            )}

            <div className="py-2.5 px-8 bg-brand hover:bg-brand-dark text-white font-black uppercase tracking-[0.2em] text-[9px] rounded-full transition-all duration-300 cursor-pointer shadow-lg shadow-brand/20 hover:shadow-brand/40 active:scale-95 border border-brand/20">
              Inquire
            </div>
          </div>

          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center text-brand-blue bg-white rounded-full border border-slate-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div 
        className={`lg:hidden fixed inset-0 bg-white/95 backdrop-blur-2xl z-40 transition-all duration-500 ease-in-out ${
          mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full justify-between p-8 pt-24">
          <div className="space-y-4">
            <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[8px] mb-8">Navigation</p>
            <div 
              className={`transform transition-all duration-700 ${mobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
            >
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="text-4xl font-black text-brand uppercase tracking-tighter hover:text-brand-blue transition-colors flex items-center justify-between group"
              >
                Cart ({cartCount})
                <ShoppingBag className="opacity-0 -translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0" size={24} />
              </Link>
            </div>
            {NAV_LINKS.map((link, i) => (
              <div 
                key={link.label}
                className={`transform transition-all duration-700 delay-[${i * 100}ms] ${mobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
              >
                <Link
                  href={link.href || "#"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-4xl font-black text-brand-blue uppercase tracking-tighter hover:text-brand transition-colors flex items-center justify-between group"
                >
                  {link.label}
                  <ArrowRight className="opacity-0 -translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0" size={24} />
                </Link>
              </div>
            ))}
          </div>
          
          <div className={`space-y-8 transform transition-all duration-700 delay-500 ${mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <div className="pt-8 border-t border-slate-200">
              <p className="text-slate-500 font-black uppercase tracking-widest text-[8px] mb-4">Connect With Us</p>
              <a href={`tel:${SITE_CONFIG.phone}`} className="text-2xl font-black text-brand-blue hover:text-brand transition-colors">{SITE_CONFIG.phone}</a>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {isAuthenticated ? (
                  <Link 
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-4 bg-brand-blue text-white text-center font-black uppercase tracking-widest text-[10px] rounded-sm shadow-lg"
                  >
                    My Dashboard
                  </Link>
                ) : (
                  <Link 
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-4 bg-brand-blue text-white text-center font-black uppercase tracking-widest text-[10px] rounded-sm shadow-lg"
                  >
                    Login / Register
                  </Link>
                )}
                <div className="py-4 bg-brand text-white text-center font-black uppercase tracking-widest text-[10px] rounded-sm cursor-pointer shadow-lg shadow-brand/20">
                  Request Quote
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}


