"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TrendingUp,
  Eye,
  Share2,
  Smartphone,
  Calendar,
  Link2,
  ChevronRight
} from "lucide-react";

export default function AnalyticsLayout({ children }) {
  const pathname = usePathname();

  const analyticsItems = [
    { icon: <TrendingUp size={16} />, label: "Overview", href: "/admin/analytics" },
    { icon: <Eye size={16} />, label: "Top Pages", href: "/admin/analytics/top-pages" },
    { icon: <Share2 size={16} />, label: "Traffic Sources", href: "/admin/analytics/traffic-sources" },
    { icon: <Smartphone size={16} />, label: "Device Categories", href: "/admin/analytics/devices" },
    { icon: <Calendar size={16} />, label: "Weekly Comparison", href: "/admin/analytics/weekly" },
    { icon: <Link2 size={16} />, label: "Top Referrers", href: "/admin/analytics/referrers" },
  ];

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Analytics Sidebar */}
      <aside className="hidden lg:block lg:col-span-1">
        <div className="sticky top-4 bg-white p-6 border border-slate-200 rounded-sm shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Reports</h3>
          <nav className="space-y-2">
            {analyticsItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all ${
                  pathname === item.href
                    ? "bg-brand text-white shadow-sm"
                    : "text-slate-600 hover:text-brand hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </div>
                {pathname === item.href && <ChevronRight size={12} />}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Analytics Navigation */}
      <div className="lg:hidden mb-6 w-full max-w-full overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar w-full">
          <div className="flex gap-2 pb-2 min-w-max">
            {analyticsItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-sm text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  pathname === item.href
                    ? "bg-brand text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:col-span-3 space-y-6 min-w-0 w-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}
