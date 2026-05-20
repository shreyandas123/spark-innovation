"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Save, LayoutTemplate, Phone, Share2, Loader2,
  Upload, Trash2, Globe, Info, QrCode, Move, BarChart3,
  TrendingUp, Users, Eye, Activity, Smartphone, MousePointerClick
} from "lucide-react";
import { fetchSiteSettings, updateSiteSettings, uploadImage, fetchAnalyticsData } from "@/lib/api";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useSettings } from "@/contexts/SettingsContext";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { token } = useAuth();
  const { showToast } = useToast();
  const { refreshSettings } = useSettings();

  const [settings, setSettings] = useState({
    websiteName: "",
    metaDescription: "",
    phone: "",
    email: "",
    address: "",
    mapsUrl: "",
    logo: "",
    favicon: "",
    topBarText: "",
    upiQrCode: "",
    whatsappNumber: "",
    social: {
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
      linkedin: ""
    },
    analytics: {
      gaMeasurementId: ""
    }
  });

  const loadSettings = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const data = await fetchSiteSettings();
      if (data && data.settings) {
        // Ensure we don't overwrite with empty values if some fields are missing
        setSettings(prev => ({
          ...prev,
          ...data.settings,
          social: {
            ...prev.social,
            ...(data.settings.social || {})
          },
          analytics: {
            ...prev.analytics,
            ...(data.settings.analytics || {})
          }
        }));
      }
    } catch (err) {
      console.error("Error loading settings:", err);
      showToast("Failed to load settings", "error");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadSettings(false);
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);
      
      showToast(`Uploading ${type}...`, "info");
      const res = await uploadImage(token, formData);
      
      if (res.url) {
        setSettings(prev => ({ ...prev, [type]: res.url }));
        showToast(`${type} uploaded successfully!`, "success");
      }
    } catch (err) {
      console.error(`Error uploading ${type}:`, err);
      showToast(err.message || `Failed to upload ${type}`, "error");
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      await updateSiteSettings(token, settings);
      showToast("Settings saved successfully!", "success");
      refreshSettings();
    } catch (err) {
      console.error("Error saving settings:", err);
      showToast(err.message || "Failed to save settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "general", label: "Branding", icon: <LayoutTemplate size={16} /> },
    { id: "contact", label: "Contact Info", icon: <Phone size={16} /> },
    { id: "social", label: "Social Media", icon: <Share2 size={16} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={16} /> },
    { id: "qr", label: "UPI / QR Code", icon: <QrCode size={16} /> },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 bg-white border border-slate-200 rounded-sm">
        <Loader2 className="animate-spin text-brand" size={32} />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Syncing with server...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-reveal">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-slate-900 p-6 md:p-8 rounded-sm border border-white/5">
        <div className="max-w-2xl">
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <Globe className="text-brand shrink-0" size={24} />
            <span className="truncate">Command Center <span className="text-brand mx-1">/</span> Site Identity</span>
          </h2>
          <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2 leading-relaxed">
            Configure your global presence and brand assets.
          </p>
        </div>
        <button 
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="w-full lg:w-auto flex items-center justify-center gap-3 bg-brand text-white px-8 py-4 rounded-sm font-black uppercase tracking-[0.2em] text-[10px] hover:bg-brand-dark transition-all shadow-xl shadow-brand/20 disabled:opacity-50 group"
        >
          {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} className="group-hover:scale-110 transition-transform" />} 
          {isSaving ? "Finalizing..." : "Publish Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8 items-start">
        {/* Navigation Sidebar / Slider */}
        <div className="bg-white border border-slate-200 rounded-sm p-1.5 shadow-sm lg:sticky lg:top-6 overflow-x-auto custom-scrollbar no-scrollbar lg:overflow-visible">
          <nav className="flex lg:flex-col gap-1 min-w-max lg:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 md:px-5 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-sm transition-all text-left whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-brand text-white shadow-lg shadow-brand/10"
                    : "text-slate-400 hover:bg-slate-50 hover:text-brand-blue"
                }`}
              >
                <span className="shrink-0">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 md:p-10 min-h-150">
            
            {activeTab === "general" && (
              <div className="space-y-10">
                <div className="border-b border-slate-100 pb-6">
                  <h3 className="text-base font-black text-brand-blue uppercase tracking-widest">General Branding</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Website name and core SEO settings.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Website Name (Displayed in Header/Footer)</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={settings.websiteName}
                        onChange={(e) => setSettings({ ...settings, websiteName: e.target.value })}
                        placeholder="Spark Innovations"
                        className="w-full border-2 border-slate-100 rounded-sm px-5 py-4 text-sm font-bold text-brand-blue focus:border-brand outline-none transition-all bg-slate-50/50" 
                      />
                      <Info size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Top Bar Announcement</label>
                    <input 
                      type="text" 
                      value={settings.topBarText}
                      onChange={(e) => setSettings({ ...settings, topBarText: e.target.value })}
                      placeholder="Authorized Kutchina Distributor"
                      className="w-full border-2 border-slate-100 rounded-sm px-5 py-4 text-sm focus:border-brand outline-none transition-all" 
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">SEO Description</label>
                    <textarea 
                      value={settings.metaDescription}
                      onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                      rows={4} 
                      placeholder="Brief description of your business for search engines..."
                      className="w-full border-2 border-slate-100 rounded-sm px-5 py-4 text-sm focus:border-brand outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                    <div className="space-y-4">
                       <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Brand Logo</label>
                       <div className="relative group">
                         <div className="border-2 border-dashed border-slate-200 rounded-sm p-6 flex flex-col items-center justify-center text-center bg-slate-50 min-h-50 transition-all group-hover:border-brand overflow-hidden">
                           {settings.logo ? (
                             <div className="relative w-full h-full min-h-35 flex items-center justify-center">
                               <Image src={settings.logo} alt="Logo Preview" fill className="object-contain" />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <button onClick={() => setSettings({ ...settings, logo: "" })} className="p-2 bg-rose-500 text-white rounded-full hover:scale-110 transition-transform">
                                    <Trash2 size={16} />
                                  </button>
                               </div>
                             </div>
                           ) : (
                             <div className="flex flex-col items-center">
                               <Upload size={32} className="text-slate-300 mb-3" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Click button below to upload</span>
                             </div>
                           )}
                         </div>
                         <label className="w-full mt-3 flex items-center justify-center gap-2 px-5 py-3 bg-brand-blue text-white rounded-sm text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-brand transition-all">
                           <Upload size={14} />
                           {settings.logo ? "Replace Brand Logo" : "Upload Brand Logo"}
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "logo")} />
                         </label>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Favicon</label>
                       <div className="relative group">
                         <div className="border-2 border-dashed border-slate-200 rounded-sm p-6 flex flex-col items-center justify-center text-center bg-slate-50 min-h-50 transition-all group-hover:border-brand overflow-hidden">
                           {settings.favicon ? (
                             <div className="relative w-20 h-20">
                               <Image src={settings.favicon} alt="Favicon Preview" fill className="object-contain" />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button onClick={() => setSettings({ ...settings, favicon: "" })} className="p-2 bg-rose-500 text-white rounded-full">
                                    <Trash2 size={14} />
                                  </button>
                               </div>
                             </div>
                           ) : (
                             <div className="flex flex-col items-center">
                               <Globe size={32} className="text-slate-300 mb-3" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Browser Tab Icon</span>
                             </div>
                           )}
                         </div>
                         <label className="w-full mt-3 flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 text-white rounded-sm text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-slate-900 transition-all">
                           <Upload size={14} />
                           {settings.favicon ? "Replace Favicon" : "Upload Favicon"}
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "favicon")} />
                         </label>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {activeTab === "contact" && (
              <div className="space-y-10">
                <div className="border-b border-slate-100 pb-6">
                  <h3 className="text-base font-black text-brand-blue uppercase tracking-widest">Contact Information</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Update phone, email and address.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Primary Phone</label>
                      <input 
                        type="text" 
                        value={settings.phone || ""}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="w-full border-2 border-slate-100 rounded-sm px-5 py-4 text-sm font-bold focus:border-brand outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Support Email</label>
                      <input 
                        type="email" 
                        value={settings.email || ""}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="w-full border-2 border-slate-100 rounded-sm px-5 py-4 text-sm font-bold focus:border-brand outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">WhatsApp Floating Support Number (With Country Code, e.g. 918808409295)</label>
                      <input 
                        type="text" 
                        value={settings.whatsappNumber || ""}
                        onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                        placeholder="918808409295"
                        className="w-full border-2 border-slate-100 rounded-sm px-5 py-4 text-sm font-bold focus:border-brand outline-none transition-all" 
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Office Address</label>
                    <textarea 
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      rows={3} 
                      className="w-full border-2 border-slate-100 rounded-sm px-5 py-4 text-sm font-bold focus:border-brand outline-none transition-all resize-none"
                    ></textarea>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Google Maps Embed URL</label>
                    <input 
                      type="text" 
                      value={settings.mapsUrl}
                      onChange={(e) => setSettings({ ...settings, mapsUrl: e.target.value })}
                      placeholder="https://maps.google.com/..." 
                      className="w-full border-2 border-slate-100 rounded-sm px-5 py-4 text-sm focus:border-brand outline-none transition-all" 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "social" && (
              <div className="space-y-10">
                <div className="border-b border-slate-100 pb-6">
                  <h3 className="text-base font-black text-brand-blue uppercase tracking-widest">Social Media Presence</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Link your official social accounts.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['Facebook', 'Instagram', 'Twitter', 'YouTube', 'LinkedIn'].map(social => (
                    <div key={social} className="space-y-3">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">{social} Profile URL</label>
                      <input
                        type="url"
                        value={settings.social?.[social.toLowerCase()] || ""}
                        onChange={(e) => setSettings({
                          ...settings,
                          social: {
                            ...settings.social,
                            [social.toLowerCase()]: e.target.value
                          }
                        })}
                        placeholder={`https://${social.toLowerCase()}.com/yourname`}
                        className="w-full border-2 border-slate-100 rounded-sm px-5 py-4 text-xs focus:border-brand outline-none transition-all font-medium"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <AnalyticsDashboard token={token} showToast={showToast} />
            )}

            {activeTab === "qr" && (
              <QrCodeTab settings={settings} setSettings={setSettings} token={token} showToast={showToast} />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Analytics Dashboard ─── */
function AnalyticsDashboard({ token, showToast }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const res = await fetchAnalyticsData(token);
        if (res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error loading analytics:', err);
        showToast(err.message || 'Failed to load analytics data', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [token, showToast]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="animate-spin text-brand" size={32} />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading analytics data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-sm p-6">
        <p className="text-[10px] font-black uppercase tracking-widest text-red-900">
          ⚠️ No Analytics Data Available
        </p>
        <p className="text-[9px] text-red-800 mt-2 font-bold uppercase">
          Please configure your Google Analytics Measurement ID in the settings above and wait 24 hours for data collection.
        </p>
      </div>
    );
  }

  const COLORS = ['#0066cc', '#00d4ff', '#ffb700', '#ff6b6b', '#51cf66'];

  return (
    <div className="space-y-10">
      <div className="border-b border-slate-100 pb-6">
        <h3 className="text-base font-black text-brand-blue uppercase tracking-widest">Analytics Dashboard</h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time website performance metrics and insights.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard icon={<Users size={18} />} label="Total Users" value={data.summary?.totalUsers?.toLocaleString() || '0'} />
        <MetricCard icon={<Activity size={18} />} label="Sessions" value={data.summary?.totalSessions?.toLocaleString() || '0'} />
        <MetricCard icon={<Eye size={18} />} label="Page Views" value={data.summary?.totalPageViews?.toLocaleString() || '0'} />
        <MetricCard icon={<TrendingUp size={18} />} label="Avg Session" value={data.summary?.avgSessionDuration || '0'} />
        <MetricCard icon={<MousePointerClick size={18} />} label="Bounce Rate" value={`${data.summary?.bounceRate || 0}%`} />
        <MetricCard icon={<BarChart3 size={18} />} label="Conversion" value={`${data.summary?.conversionRate || 0}%`} />
      </div>

      {/* Users & Sessions Over Time */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm">
        <h4 className="text-[11px] font-black uppercase tracking-widest text-brand-blue mb-4">Users & Sessions (Last 30 Days)</h4>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.usersOverTime || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #cbd5e1' }} />
            <Legend />
            <Area type="monotone" dataKey="users" stackId="1" stroke="#0066cc" fill="#0066cc" fillOpacity={0.6} name="Users" />
            <Area type="monotone" dataKey="sessions" stackId="1" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.6} name="Sessions" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-brand-blue mb-4">Top Pages</h4>
          <div className="space-y-3">
            {(data.topPages || []).map((page, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-sm">
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-800 truncate">{page.page}</p>
                  <p className="text-[8px] text-slate-500 mt-1">{page.pageViews} views • {page.users} users</p>
                </div>
                <span className="text-[10px] font-black text-brand ml-2 shrink-0">{page.avgTime}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources Pie Chart */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-brand-blue mb-4">Traffic Sources</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.trafficSources || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name} (${entry.percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {(data.trafficSources || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Device Categories */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm">
        <h4 className="text-[11px] font-black uppercase tracking-widest text-brand-blue mb-4">Traffic by Device</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.deviceCategories || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="device" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #cbd5e1' }} />
            <Bar dataKey="sessions" fill="#0066cc" name="Sessions" />
          </BarChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-3 gap-4 mt-6">
          {(data.deviceCategories || []).map((device, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-sm text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">{device.device}</p>
              <p className="text-lg font-black text-brand mt-2">{device.percentage}%</p>
              <p className="text-[8px] text-slate-400 mt-1">{device.sessions} sessions</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Comparison */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-brand-blue mb-4">Weekly Comparison</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.weeklyComparison || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #cbd5e1' }} />
              <Legend />
              <Bar dataKey="users" fill="#0066cc" name="Users" />
              <Bar dataKey="sessions" fill="#00d4ff" name="Sessions" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Referrers */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-brand-blue mb-4">Top Referrers</h4>
          <div className="space-y-3">
            {(data.topReferrers || []).map((referrer, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-sm">
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-800 truncate">{referrer.referrer}</p>
                  <p className="text-[8px] text-slate-500 mt-1">{referrer.sessions} sessions</p>
                </div>
                <div className="text-right ml-2">
                  <p className="text-[10px] font-black text-brand">{referrer.users}</p>
                  <p className="text-[8px] text-slate-400">users</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
        <p className="text-[9px] font-black uppercase tracking-widest text-blue-900 flex items-center gap-2">
          <Info size={14} />
          Data Updated Hourly
        </p>
        <p className="text-[9px] text-blue-800 mt-2 font-bold">
          These are your website analytics from Google Analytics 4. Data includes all visitors, page views, and engagement metrics.
        </p>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-sm p-4 text-center">
      <div className="flex justify-center text-brand mb-2">{icon}</div>
      <p className="text-[8px] font-black uppercase tracking-widest text-slate-600">{label}</p>
      <p className="text-lg md:text-xl font-black text-brand-blue mt-2">{value}</p>
    </div>
  );
}

/* ─── QR Code Image Cropper + Upload Tab ─── */
function QrCodeTab({ settings, setSettings, token, showToast }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const [rawImage, setRawImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, size: 200 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [uploading, setUploading] = useState(false);
  const [imgDimensions, setImgDimensions] = useState({ w: 0, h: 0, displayW: 0, displayH: 0 });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setRawImage(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const onImageLoad = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const natW = img.naturalWidth;
    const natH = img.naturalHeight;
    const container = containerRef.current;
    const displayW = container ? container.clientWidth : 400;
    const scale = displayW / natW;
    const displayH = natH * scale;
    setImgDimensions({ w: natW, h: natH, displayW, displayH });
    const initSize = Math.min(displayW, displayH, 280);
    setCrop({ x: (displayW - initSize) / 2, y: (displayH - initSize) / 2, size: initSize });
  }, []);

  const handlePointerDown = (e) => {
    e.preventDefault();
    setDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    const px = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const py = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    setDragStart({ x: px - crop.x, y: py - crop.y });
  };

  const handlePointerMove = useCallback((e) => {
    if (!dragging) return;
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const px = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const py = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    setCrop(prev => ({
      ...prev,
      x: Math.max(0, Math.min(px - dragStart.x, imgDimensions.displayW - prev.size)),
      y: Math.max(0, Math.min(py - dragStart.y, imgDimensions.displayH - prev.size)),
    }));
  }, [dragging, dragStart, imgDimensions]);

  const handlePointerUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    if (!rawImage) return;
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handlePointerMove, { passive: false });
    window.addEventListener("touchend", handlePointerUp);
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [rawImage, handlePointerMove, handlePointerUp]);

  const handleCropAndUpload = async () => {
    if (!imgRef.current) return;
    try {
      setUploading(true);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const outputSize = 500;
      canvas.width = outputSize;
      canvas.height = outputSize;

      const scaleX = imgDimensions.w / imgDimensions.displayW;
      const scaleY = imgDimensions.h / imgDimensions.displayH;
      const sx = crop.x * scaleX;
      const sy = crop.y * scaleY;
      const sSize = crop.size * scaleX;

      ctx.drawImage(imgRef.current, sx, sy, sSize, sSize, 0, 0, outputSize, outputSize);

      const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png", 0.95));
      const formData = new FormData();
      formData.append("image", blob, "upi-qr.png");

      showToast("Uploading cropped QR code...", "info");
      const res = await uploadImage(token, formData);
      if (res.url) {
        setSettings(prev => ({ ...prev, upiQrCode: res.url }));
        setRawImage(null);
        showToast("QR code uploaded! Don't forget to Publish Changes.", "success");
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to upload QR code", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-10">
      <canvas ref={canvasRef} className="hidden" />

      <div className="border-b border-slate-100 pb-6">
        <h3 className="text-base font-black text-brand-blue uppercase tracking-widest">UPI / QR Code Setup</h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Upload your payment QR code. Customers will scan this during checkout.</p>
      </div>

      {/* Current QR Preview */}
      {settings.upiQrCode && !rawImage && (
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-64 h-64 border-4 border-brand/20 rounded-sm overflow-hidden shadow-lg group">
            <Image src={settings.upiQrCode} alt="Current UPI QR" fill className="object-cover" sizes="256px" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => setSettings(prev => ({ ...prev, upiQrCode: "" }))}
                className="p-3 bg-rose-500 text-white rounded-full hover:scale-110 transition-transform"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">QR Code Active</span>
        </div>
      )}

      {/* Upload / Crop Area */}
      {!rawImage ? (
        <div className="flex flex-col items-center">
          <label className="w-full max-w-sm flex items-center justify-center gap-3 px-6 py-4 bg-brand-blue text-white rounded-sm text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-brand transition-all shadow-lg">
            <Upload size={16} />
            {settings.upiQrCode ? "Replace QR Code" : "Upload QR Code Image"}
            <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
          </label>
          <p className="text-[9px] text-slate-400 font-medium mt-3 uppercase tracking-widest text-center">
            Upload any image — you&apos;ll crop it to a square next.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-sm p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Move size={14} className="text-brand" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Drag the square to position your crop</p>
            </div>

            <div
              ref={containerRef}
              className="relative mx-auto select-none touch-none overflow-hidden bg-slate-200 rounded-sm"
              style={{ maxWidth: 500 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={rawImage}
                alt="Crop preview"
                onLoad={onImageLoad}
                className="w-full h-auto block"
                draggable={false}
              />
              {/* Dark overlay outside crop */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: `linear-gradient(to right, rgba(0,0,0,0.55) ${crop.x}px, transparent ${crop.x}px, transparent ${crop.x + crop.size}px, rgba(0,0,0,0.55) ${crop.x + crop.size}px)`,
              }} />
              <div className="absolute pointer-events-none" style={{
                left: crop.x, top: 0, width: crop.size, height: crop.y,
                background: "rgba(0,0,0,0.55)",
              }} />
              <div className="absolute pointer-events-none" style={{
                left: crop.x, top: crop.y + crop.size, width: crop.size, bottom: 0,
                background: "rgba(0,0,0,0.55)",
              }} />
              {/* Crop box */}
              <div
                className="absolute border-2 border-brand cursor-move rounded-sm shadow-xl"
                style={{ left: crop.x, top: crop.y, width: crop.size, height: crop.size }}
                onMouseDown={handlePointerDown}
                onTouchStart={handlePointerDown}
              >
                <div className="absolute inset-0 border border-white/30" />
                {/* Corner indicators */}
                {[
                  "top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"
                ].map(pos => (
                  <div key={pos} className={`absolute ${pos} w-3 h-3 border-2 border-brand bg-white rounded-sm`} />
                ))}
              </div>
            </div>

            {/* Size slider */}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 shrink-0">Crop Size</span>
              <input
                type="range"
                min={100}
                max={Math.min(imgDimensions.displayW || 400, imgDimensions.displayH || 400)}
                value={crop.size}
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  setCrop(prev => ({
                    size: newSize,
                    x: Math.min(prev.x, (imgDimensions.displayW || 400) - newSize),
                    y: Math.min(prev.y, (imgDimensions.displayH || 400) - newSize),
                  }));
                }}
                className="flex-1 accent-brand"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCropAndUpload}
              disabled={uploading}
              className="flex-1 flex items-center justify-center gap-3 bg-brand text-white px-6 py-4 rounded-sm font-black uppercase tracking-widest text-[10px] hover:bg-brand-dark transition-all shadow-lg disabled:opacity-50"
            >
              {uploading ? <Loader2 className="animate-spin" size={16} /> : <QrCode size={16} />}
              {uploading ? "Uploading..." : "Crop & Upload QR"}
            </button>
            <button
              onClick={() => setRawImage(null)}
              className="px-6 py-4 border-2 border-slate-200 rounded-sm font-black uppercase tracking-widest text-[10px] text-slate-400 hover:border-rose-300 hover:text-rose-500 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
