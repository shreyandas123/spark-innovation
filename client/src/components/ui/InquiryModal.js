"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import InquiryForm from "./InquiryForm";

export default function InquiryModal({ isOpen, onClose, product }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-blue/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden animate-reveal">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-sm font-black text-brand-blue uppercase tracking-widest">Product Inquiry</h2>
            {product && <p className="text-[10px] text-brand font-bold uppercase mt-1">{product.name}</p>}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-brand">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <InquiryForm 
            product={product} 
            onSuccess={() => {
              setTimeout(onClose, 3000);
            }} 
          />
        </div>
      </div>
    </div>
  );
}
