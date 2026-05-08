"use client";

export default function ProductSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="aspect-square bg-slate-100 rounded-sm"></div>
      <div className="space-y-2">
        <div className="h-2 bg-slate-100 rounded-full w-2/3"></div>
        <div className="h-2 bg-slate-100 rounded-full w-1/3"></div>
      </div>
      <div className="h-10 bg-slate-100 rounded-sm w-full"></div>
    </div>
  );
}
