"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { Phone, Menu, X, ArrowRight, ShoppingBag, User, Heart } from "lucide-react";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";

import { usePathname } from "next/navigation";
import { fetchCategories } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        if (data && data.categories) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Error loading categories for navbar:", error);
      }
    };
    
    loadCategories();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        isScrolled ? "py-2 shadow-sm" : "py-3 md:py-4"
      } border-b border-slate-50`}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 relative flex items-center justify-center">
              <Image src="/favicon.ico" alt="Spark Innovations Logo" fill className="object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black uppercase tracking-tighter">
                Spark <span className="text-brand">Innovations</span>
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="relative group/nav">
                {link.isDropdown ? (
                  <>
                    <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-brand transition-colors py-2 flex items-center gap-1">
                      {link.label}
                      <span className="w-1 h-1 bg-brand rounded-full opacity-0 group-hover/nav:opacity-100 transition-opacity" />
                    </button>
                    
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible translate-y-4 group-hover/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0 transition-all duration-300 z-50">
                      <div className="bg-white border border-slate-100 shadow-2xl rounded-sm p-6 min-w-[240px]">
                        <div className="grid gap-4">
                          {categories.length > 0 ? (
                            categories.map((cat) => (
                              <Link 
                                key={cat.slug} 
                                href={`/categories/${cat.slug}`}
                                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand transition-colors flex items-center justify-between group/cat"
                              >
                                {cat.name}
                                <ArrowRight size={12} className="opacity-0 -translate-x-2 transition-all group-hover/cat:opacity-100 group-hover/cat:translate-x-0" />
                              </Link>
                            ))
                          ) : (
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 text-center">Loading Categories...</p>
                          )}
                          <div className="pt-4 border-t border-slate-50">
                            <Link href="/products" className="text-[9px] font-black uppercase tracking-widest text-brand-blue hover:text-brand flex items-center gap-2">
                              View All Collection <ArrowRight size={10} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href || "#"}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-brand transition-colors py-2 block"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {mounted && (
              <>
                <Link 
                  href={isAuthenticated ? "/wishlist" : "/auth/login?redirect=/wishlist"} 
                  className="relative text-brand-blue hover:text-brand transition-colors" 
                  aria-label={`View Wishlist (${wishlistCount} items)`}
                >
                  <Heart size={18} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-brand text-white text-[8px] font-bold flex items-center justify-center rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <div className="relative group/cart">
                  <Link href="/cart" className="relative text-brand-blue hover:text-brand transition-colors block py-2" aria-label={`View Shopping Cart (${cartCount} items)`}>
                    <ShoppingBag size={18} />
                    {cartCount > 0 && (
                      <span className="absolute -top-0 -right-2 w-4 h-4 bg-brand text-white text-[8px] font-bold flex items-center justify-center rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
              </>
            )}

            {mounted && isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/me" className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-brand-dark flex items-center justify-center bg-brand text-white">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={14} />
                    )}
                  </div>
                </Link>
              </div>
            ) : (
              <Link 
                href="/auth/login"
                className="text-[9px] font-bold uppercase tracking-widest text-brand-blue hover:text-brand transition-colors"
              >
                Login
              </Link>
            )}

            <button className="px-5 py-2 bg-brand text-white font-bold uppercase tracking-widest text-[9px] rounded-sm hover:bg-brand-dark transition-all">
              Inquiry
            </button>
          </div>

          <button
            className="lg:hidden p-2 text-brand-blue"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div 
        className={`lg:hidden fixed inset-0 bg-white z-40 transition-all duration-500 ease-in-out ${
          mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full justify-between p-8 pt-24 pb-12">
          <div className="space-y-4">
            <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[8px] mb-6">Navigation</p>
            {NAV_LINKS.map((link) => (
              <div key={link.label}>
                {link.isDropdown ? (
                  <div className="space-y-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">{link.label}</p>
                    <div className="grid gap-4 pl-4 border-l border-slate-100">
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/categories/${cat.slug}`}
                          className="text-lg font-black text-brand-blue uppercase tracking-tight"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.href || "#"}
                    className="text-2xl font-black text-brand-blue uppercase tracking-tighter block"
                    onClick={() => setMobileMenuOpen(false)}
        </Link>

        <Link href="/me" className={`flex flex-col items-center gap-1 ${pathname === '/me' ? 'text-brand' : 'text-slate-400'}`}>
          <div className={`p-1.5 rounded-xl transition-all ${pathname === '/me' ? 'bg-brand/10' : ''}`}>
            <User size={18} />
          </div>
          <span className="text-[7px] font-black uppercase tracking-widest">Profile</span>
        </Link>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`flex flex-col items-center gap-1 ${mobileMenuOpen ? 'text-brand' : 'text-slate-400'}`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${mobileMenuOpen ? 'bg-brand/10' : ''}`}>
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </div>
          <span className="text-[7px] font-black uppercase tracking-widest">More</span>
        </button>
      </div>
    </nav>
  );
}






