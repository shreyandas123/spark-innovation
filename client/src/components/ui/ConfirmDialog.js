"use client";

import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ isOpen, onConfirm, onCancel, title = "Are you sure?", message, confirmLabel = "Delete", danger = true }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-sm shadow-2xl p-8 max-w-sm w-full animate-reveal">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${danger ? 'bg-red-50 text-red-500' : 'bg-brand/10 text-brand'}`}>
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-sm font-black text-brand-blue uppercase tracking-widest mb-2">{title}</h3>
        {message && <p className="text-sm text-slate-500 font-medium leading-relaxed mt-1 mb-8">{message}</p>}
        <div className={`flex gap-3 ${message ? '' : 'mt-8'}`}>
          <button
            onClick={onCancel}
            className="flex-1 py-3 border border-slate-200 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 text-white font-black uppercase tracking-widest text-[10px] rounded-sm transition-colors ${
              danger ? 'bg-red-500 hover:bg-red-600' : 'bg-brand hover:bg-brand-dark'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
