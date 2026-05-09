"use client";

import { useState, useEffect } from "react";
import { 
  Save, LayoutTemplate, Type, Phone, Share2, Loader2, 
  Upload, Trash2, Globe, Eye, Info, AlertCircle 
} from "lucide-react";
import { fetchSiteSettings, updateSiteSettings, uploadImage } from "@/lib/api";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useSettings } from "@/contexts/SettingsContext";

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
    heroHeadline: "",
    heroSubheadline: "",
    phone: "",
    email: "",
    address: "",
    mapsUrl: "",
    logo: "",
    favicon: "",
    topBarText: "",
    social: {
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
      linkedin: ""
    }
  });

  const loadSettings = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const data = await fetchSiteSettings();
      console.log("Loaded Settings:", data);
      
      if (data && data.settings) {
        // Ensure we don't overwrite with empty values if some fields are missing
        setSettings(prev => ({
          ...prev,
          ...data.settings,
          social: {
            ...prev.social,
            ...(data.settings.social || {})
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
    loadSettings();
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
    { id: "homepage", label: "Hero Content", icon: <Type size={16} /> },
    { id: "contact", label: "Contact Info", icon: <Phone size={16} /> },
    { id: "social", label: "Social Media", icon: <Share2 size={16} /> },
    { id: "preview", label: "Live Preview", icon: <Eye size={16} /> },
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
    <div className="space-y-8 animate-reveal">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-slate-900 p-6 md:p-8 rounded-sm border border-white/5">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <Globe className="text-brand" size={24} />
            Command Center <span className="text-brand">/</span> Site Identity
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2">
            Configure your global presence and brand assets.
          </p>
        </div>
        <button 
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="w-full sm:w-auto flex items-center justify-center gap-3 bg-brand text-white px-8 py-4 rounded-sm font-black uppercase tracking-[0.2em] text-[10px] hover:bg-brand-dark transition-all shadow-xl shadow-brand/20 disabled:opacity-50 group"
        >
          {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} className="group-hover:scale-110 transition-transform" />} 
          {isSaving ? "Finalizing..." : "Publish Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="bg-white border border-slate-200 rounded-sm p-2 shadow-sm lg:sticky lg:top-6">
          <nav className="flex lg:flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-5 py-4 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all text-left ${
                  activeTab === tab.id
                    ? "bg-brand text-white shadow-lg shadow-brand/10"
                    : "text-slate-400 hover:bg-slate-50 hover:text-brand-blue"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 md:p-10 min-h-[600px]">
            
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
                         <div className="border-2 border-dashed border-slate-200 rounded-sm p-6 flex flex-col items-center justify-center text-center bg-slate-50 min-h-[200px] transition-all group-hover:border-brand overflow-hidden">
                           {settings.logo ? (
                             <div className="relative w-full h-full min-h-[140px] flex items-center justify-center">
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
                         <div className="border-2 border-dashed border-slate-200 rounded-sm p-6 flex flex-col items-center justify-center text-center bg-slate-50 min-h-[200px] transition-all group-hover:border-brand overflow-hidden">
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

            {activeTab === "homepage" && (
              <div className="space-y-10">
                <div className="border-b border-slate-100 pb-6">
                  <h3 className="text-base font-black text-brand-blue uppercase tracking-widest">Hero Section Content</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">The primary message on your home page.</p>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Main Headline</label>
                    <input 
                      type="text" 
                      value={settings.heroHeadline}
                      onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                      placeholder="REVOLUTIONIZING MODERN KITCHENS"
                      className="w-full border-2 border-slate-100 rounded-sm px-5 py-4 text-xl font-black text-brand-blue focus:border-brand outline-none transition-all uppercase tracking-tighter" 
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Subheadline / Description</label>
                    <textarea 
                      value={settings.heroSubheadline}
                      onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
                      placeholder="Explore our wide range of premium appliances..."
                      rows={3}
                      className="w-full border-2 border-slate-100 rounded-sm px-5 py-4 text-sm focus:border-brand outline-none transition-all font-medium leading-relaxed" 
                    ></textarea>
                  </div>

                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-sm">
                    <div className="flex gap-3 items-start">
                      <AlertCircle className="text-brand shrink-0" size={18} />
                      <div>
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">Headline Tips</p>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                          Keep your headline punchy and short (5-8 words). Your subheadline should explain what makes your service unique.
                        </p>
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
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="w-full border-2 border-slate-100 rounded-sm px-5 py-4 text-sm font-bold focus:border-brand outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Support Email</label>
                      <input 
                        type="email" 
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
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

            {activeTab === "preview" && (
              <div className="space-y-10">
                <div className="border-b border-slate-100 pb-6">
                  <h3 className="text-base font-black text-brand-blue uppercase tracking-widest">Brand Visualizer</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">How your header will look to users.</p>
                </div>

                <div className="space-y-12">
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Navbar Preview</label>
                    <div className="border border-slate-200 rounded-sm p-8 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 relative">
                          <Image src={settings.logo || "/favicon.ico"} alt="Logo" fill className="object-contain" />
                        </div>
                        <span className="text-xl font-black uppercase tracking-tighter text-slate-900">
                          {settings.websiteName.split(' ')[0]} <span className="text-brand">{settings.websiteName.split(' ').slice(1).join(' ') || "Innovations"}</span>
                        </span>
                      </div>
                      <div className="flex gap-6">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">Home</span>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">Products</span>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">Contact</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Hero Section Preview</label>
                    <div className="border border-slate-200 rounded-sm p-12 bg-white flex flex-col items-center text-center space-y-6">
                      <div className="px-3 py-1 bg-slate-50 border border-slate-100 text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">PREMIUM COLLECTION</div>
                      <h4 className="text-4xl font-black text-slate-900 leading-tight uppercase tracking-tighter max-w-lg">
                        {settings.heroHeadline || "YOUR HEADLINE HERE"}
                      </h4>
                      <p className="text-sm text-slate-500 font-medium max-w-md">
                        {settings.heroSubheadline || "Your subheadline or description will appear here to provide more context about your offerings."}
                      </p>
                      <div className="px-8 py-3 bg-brand text-white text-[9px] font-black uppercase tracking-widest rounded-sm">Shop Now</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
